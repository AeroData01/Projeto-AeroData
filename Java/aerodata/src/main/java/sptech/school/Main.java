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

            // 🔔 Slack: início
            Slack.enviarMensagem("🚀 Iniciando processo ETL do AeroData.");
            logger.info("Iniciando ETL do AeroData");

            // 📦 Validação do bucket
             try {
    // diagnóstico
    s3.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
    log.info("Bucket {} válido!", bucket);

    // validação “oficial” (já coberta pelo headBucket acima)
    logger.info("Validando bucket: " + bucket);

} catch (NoSuchBucketException e) {
    // bucket não existe
    logger.error("Bucket não encontrado: " + bucket);
    Slack.enviarMensagem("❌ Bucket não encontrado: " + bucket);
    return;

} catch (S3Exception e) {
    // diagnóstico extra
    System.err.println("→ Código HTTP   : " + e.statusCode());
    System.err.println("→ Error Code    : " + e.awsErrorDetails().errorCode());
    System.err.println("→ Mensagem      : " + e.awsErrorDetails().errorMessage());
    System.err.println("→ Request ID    : " + e.requestId());

    // publicação de erro no Slack
    logger.error("Erro ao validar bucket: " + e.awsErrorDetails().errorMessage());
    Slack.enviarMensagem("❌ Erro ao validar bucket: " + e.awsErrorDetails().errorMessage());
    return;
}

            // 📥 Download da planilha (se necessário)
            if (Files.exists(downloadPath)) {
                logger.info("Usando planilha local existente: " + downloadPath);
            } else {
                try {
                    logger.info("Baixando planilha do S3: " + key);
                    s3.getObject(
                        GetObjectRequest.builder().bucket(bucket).key(key).build(),
                        ResponseTransformer.toFile(downloadPath)
                    );
                    logger.info("Planilha baixada com sucesso em: " + downloadPath);
                } catch (S3Exception e) {
                    logger.error("Erro no download da planilha: " + e.awsErrorDetails().errorMessage());
                    Slack.enviarMensagem("❌ Falha ao baixar planilha do S3.");
                    return;
                }
            }

            // 📊 Leitura e preparação dos dados
            logger.info("🔄 Iniciando leitura da planilha...");
            long startRead = System.currentTimeMillis();

            List<Voo> voos = new LeitorPlanilha().lerVoos(downloadPath.toString());

            long endRead = System.currentTimeMillis();
            int totalLidos = voos.size();
            double duracaoReadSeg = (endRead - startRead) / 1000.0;
            double mediaReadPorSeg = totalLidos / (duracaoReadSeg > 0 ? duracaoReadSeg : 1);

            logger.info(String.format(
                "✅ Leitura concluída: %d registros em %d ms (média: %.2f registros/s)",
                totalLidos, (endRead - startRead), mediaReadPorSeg
            ));

            // 🗂️ Carrega voos existentes no banco
            Set<String> existentes = new HashSet<>();
            try (PreparedStatement ps = connection.prepareStatement(
                     "SELECT numero_voo, dia_referencia FROM Voos");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String numero = rs.getString("numero_voo");
                    java.sql.Date data = rs.getDate("dia_referencia");
                    existentes.add(numero + "|" + data);
                }
            }

            // 🔍 Filtra apenas voos novos
            List<Voo> novosVoos = new ArrayList<>();
            for (Voo voo : voos) {
                String chave = voo.getNumeroVoo() + "|" + voo.getDataReferencia();
                if (!existentes.contains(chave)) {
                    novosVoos.add(voo);
                }
            }

            // 💾 Inserção no banco
            if (novosVoos.isEmpty()) {
                logger.info("ℹ️ Nenhum voo novo para inserir.");
                Slack.enviarMensagem("ℹ️ Nenhum voo novo foi encontrado para inserir.");
            } else {
                int totalNovos = novosVoos.size();
                logger.info("🔄 " + totalNovos + " voos novos encontrados. Iniciando carga...");

                long startLoad = System.currentTimeMillis();
                try {
                    new VooRepository().salvarVoos(connection, novosVoos);
                    connection.commit();

                    long endLoad = System.currentTimeMillis();
                    double duracaoLoadSeg = (endLoad - startLoad) / 1000.0;
                    double mediaLoadPorSeg = totalNovos / (duracaoLoadSeg > 0 ? duracaoLoadSeg : 1);

                    logger.info(String.format(
                        "✅ Carga concluída: %d registros em %d ms (média: %.2f registros/s)",
                        totalNovos, (endLoad - startLoad), mediaLoadPorSeg
                    ));

                    logger.info("✅ Voos inseridos com sucesso.");
                    inseriuComSucesso = true;
                } catch (SQLException e) {
                    logger.error("Erro ao salvar voos: " + e.getMessage());
                    Slack.enviarMensagem("❌ Erro ao salvar voos: " + e.getMessage());
                    try {
                        connection.rollback();
                        logger.warn("Transação revertida.");
                    } catch (SQLException ex) {
                        logger.error("Erro ao fazer rollback: " + ex.getMessage());
                    }
                }
            }

            // ✅ Mensagens finais do Slack
            if (inseriuComSucesso) {
                Slack.enviarMensagem("✅ " + novosVoos.size() + " voos inseridos com sucesso.");
            }

            logger.info("ETL concluído com sucesso.");
            Slack.enviarMensagem("🏁 ETL finalizado com sucesso.");

        } catch (Exception e) {
            System.err.println("Erro fatal no ETL: " + e.getMessage());
            e.printStackTrace();
            try {
                Slack.enviarMensagem("🔥 Erro fatal no ETL: " + e.getMessage());
            } catch (Exception ex) {
                System.err.println("Falha ao enviar erro para o Slack.");
            }
        }
    }
}
