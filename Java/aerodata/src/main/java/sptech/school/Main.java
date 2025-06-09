package sptech.school;

import sptech.school.db.DBConnectionProvider;
import sptech.school.excel.LeitorPlanilha;
import sptech.school.log.LogService;
import sptech.school.model.Voo;
import sptech.school.repository.VooRepository;
import sptech.school.s3.S3Provider;
import sptech.school.slack.Slack;

import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import org.apache.poi.util.IOUtils;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Ajuste do Apache POI para arquivos grandes
        IOUtils.setByteArrayMaxOverride(150_000_000);
        System.setProperty("poi.ooxml.saxParserFactory", "com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl");

        String bucket = System.getenv("S3_BUCKET");
        String key = System.getenv("S3_OBJECT_KEY");
        Path downloadPath = new File("downloaded-planilha.xlsx").toPath();
        boolean inseriuComSucesso = false;

        if (bucket == null || key == null) {
            throw new IllegalArgumentException("Variáveis de ambiente S3_BUCKET ou S3_OBJECT_KEY não foram definidas.");
        }

        try (
            Connection connection = new DBConnectionProvider().getConnection();
            S3Client s3 = new S3Provider().getS3Client()
        ) {
            connection.setAutoCommit(false);
            LogService logger = new LogService(connection);

            // 🔔 Slack: início geral
            Slack.enviarMensagem("🚀 Iniciando processo ETL do AeroData.");
            logger.info("Iniciando ETL do AeroData");

            // 📦 Validação do bucket
            try {
                s3.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
                logger.info("Bucket " + bucket + " válido!");
                Slack.enviarMensagem("✅ Bucket `" + bucket + "` validado com sucesso.");
            } catch (NoSuchBucketException e) {
                logger.error("Bucket não encontrado: " + bucket);
                Slack.enviarMensagem("❌ Bucket não encontrado: `" + bucket + "`.");
                return;
            } catch (S3Exception e) {
                logger.error("Erro ao validar bucket: " + e.awsErrorDetails().errorMessage());
                Slack.enviarMensagem("❌ Erro ao validar bucket: " + e.awsErrorDetails().errorMessage());
                return;
            }

            // 📥 Download da planilha
            if (Files.exists(downloadPath)) {
                logger.info("Usando planilha local existente: " + downloadPath);
                Slack.enviarMensagem("⚠️ Usando planilha local em `" + downloadPath + "`.");
            } else {
                try {
                    logger.info("Baixando planilha do S3: " + key);
                    Slack.enviarMensagem("📥 Iniciando download da planilha `" + key + "`.");
                    s3.getObject(
                        GetObjectRequest.builder().bucket(bucket).key(key).build(),
                        ResponseTransformer.toFile(downloadPath)
                    );
                    logger.info("Planilha baixada com sucesso em: " + downloadPath);
                    Slack.enviarMensagem("✅ Planilha baixada em `" + downloadPath + "`.");
                } catch (S3Exception e) {
                    logger.error("Erro no download da planilha: " + e.awsErrorDetails().errorMessage());
                    Slack.enviarMensagem("❌ Falha ao baixar planilha do S3: " + e.awsErrorDetails().errorMessage());
                    return;
                }
            }

            // 📊 Leitura e preparação dos dados
            logger.info("🔄 Iniciando leitura da planilha...");
            Slack.enviarMensagem("🔄 Iniciando leitura da planilha…");
            long startRead = System.currentTimeMillis();

            List<Voo> voos = new LeitorPlanilha().lerVoos(downloadPath.toString());

            long endRead = System.currentTimeMillis();
            int totalLidos = voos.size();
            double duracaoReadSeg = (endRead - startRead) / 1000.0;
            logger.info(String.format("✅ Leitura concluída: %d registros em %d ms", totalLidos, (endRead - startRead)));
            Slack.enviarMensagem(String.format("📊 Leitura concluída: *%d* registros em *%.2f* s.", totalLidos, duracaoReadSeg));

            // 🗂️ Carrega voos existentes no banco
            Set<String> existentes = new HashSet<>();
            try (PreparedStatement ps = connection.prepareStatement(
                     "SELECT numero_voo, dia_referencia FROM Voos");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    existentes.add(rs.getString("numero_voo") + "|" + rs.getDate("dia_referencia"));
                }
            }
            logger.info("ℹ️ Voos existentes carregados: " + existentes.size());
            Slack.enviarMensagem("ℹ️ Voos existentes no banco: *" + existentes.size() + "*");

            // 🔍 Filtra apenas voos novos
            List<Voo> novosVoos = new ArrayList<>();
            for (Voo voo : voos) {
                String chave = voo.getNumeroVoo() + "|" + voo.getDataReferencia();
                if (!existentes.contains(chave)) {
                    novosVoos.add(voo);
                }
            }
            logger.info("🔍 Encontrados " + novosVoos.size() + " voos novos.");
            Slack.enviarMensagem("🔍 Encontrados *" + novosVoos.size() + "* voos que ainda não estavam no banco.");

            // 💾 Inserção no banco
            if (novosVoos.isEmpty()) {
                logger.info("ℹ️ Nenhum voo novo para inserir.");
                Slack.enviarMensagem("ℹ️ Nenhum voo novo foi encontrado para inserir.");
            } else {
                Slack.enviarMensagem("💾 Iniciando inserção de *" + novosVoos.size() + "* novos voos…");
                logger.info("🔄 " + novosVoos.size() + " voos novos encontrados. Iniciando carga...");
                long startLoad = System.currentTimeMillis();

                try {
                    new VooRepository().salvarVoos(connection, novosVoos);
                    connection.commit();

                    long endLoad = System.currentTimeMillis();
                    double duracaoLoadSeg = (endLoad - startLoad) / 1000.0;
                    logger.info(String.format("✅ Carga concluída: %d registros em %d ms", novosVoos.size(), (endLoad - startLoad)));
                    Slack.enviarMensagem(String.format("✅ Inseridos *%d* voos em *%.2f* s.", novosVoos.size(), duracaoLoadSeg));

                    inseriuComSucesso = true;
                } catch (SQLException e) {
                    logger.error("Erro ao salvar voos: " + e.getMessage());
                    Slack.enviarMensagem("❌ Erro ao salvar voos: " + e.getMessage());
                    try {
                        connection.rollback();
                        logger.warn("Transação revertida.");
                        Slack.enviarMensagem("⚠️ Rollback executado devido a erro na carga.");
                    } catch (SQLException ex) {
                        logger.error("Erro ao fazer rollback: " + ex.getMessage());
                        Slack.enviarMensagem("❌ Falha ao realizar rollback: " + ex.getMessage());
                    }
                }
            }

            // ✅ Mensagens finais do Slack
            if (inseriuComSucesso) {
                Slack.enviarMensagem("🏁 ETL finalizado com sucesso. Total de novos voos inseridos: *" + ( /* novosVoos pode ter sido filtrado acima */ novosVoos.size() ) + "*.");
            } else {
                Slack.enviarMensagem("🏁 ETL finalizado sem inserções.");
            }

            logger.info("ETL concluído com sucesso.");

        } catch (Exception e) {
            System.err.println("Erro fatal no ETL: " + e.getMessage());
            e.printStackTrace();
            try {
                Slack.enviarMensagem("🔥 Erro fatal no ETL: " + e.getMessage());
            } catch (Exception ex) {
                System.err.println("Falha ao enviar erro para o Slack: " + ex.getMessage());
            }
        }
    }
}
