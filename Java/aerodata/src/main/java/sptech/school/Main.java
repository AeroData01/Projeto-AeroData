package sptech.school;

import sptech.school.db.DBConnectionProvider;
import sptech.school.excel.LeitorPlanilha;
import sptech.school.log.LogService;
import sptech.school.model.Voo;
import sptech.school.repository.VooRepository;
import sptech.school.s3.S3Provider;

import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import org.apache.poi.util.IOUtils;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // Ajuste para suportar arquivos grandes no Apache POI
        IOUtils.setByteArrayMaxOverride(150_000_000);
        System.setProperty("poi.ooxml.saxParserFactory", "com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl");

        String bucket = "aero-data-bucket";
        String key = "Base de Dados - AeroData.xlsx";
        Path downloadPath = new File("downloaded-planilha.xlsx").toPath();

        try (
                Connection connection = new DBConnectionProvider().getConnection();
                S3Client s3 = new S3Provider().getS3Client()
        ) {
            connection.setAutoCommit(false);
            LogService logger = new LogService(connection);

            logger.info("Iniciando ETL do AeroData");

            // Validação do bucket
            try {
                logger.info("Validando bucket: " + bucket);
                s3.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
            } catch (NoSuchBucketException e) {
                logger.error("Bucket não encontrado: " + bucket);
                return;
            } catch (S3Exception e) {
                logger.error("Erro ao validar bucket: " + e.awsErrorDetails().errorMessage());
                return;
            }

            // Verifica se a planilha já existe localmente
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
                    return;
                }
            }

            // Leitura da planilha
            logger.info("Lendo planilha...");
            List<Voo> voos = new LeitorPlanilha().lerVoos(downloadPath.toString());
            logger.info("Total de voos lidos: " + voos.size());

            // Busca voos já existentes no banco
            Set<String> existentes = new HashSet<>();
            try (PreparedStatement ps = connection.prepareStatement(
                    "SELECT numero_voo, dia_referencia FROM Voos");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String numero = rs.getString("numero_voo");
                    Date data = rs.getDate("dia_referencia");
                    existentes.add(numero + "|" + data);
                }
            }

            // Filtra voos novos
            List<Voo> novosVoos = new ArrayList<>();
            for (Voo voo : voos) {
                String chave = voo.getNumeroVoo() + "|" + voo.getDataReferencia();
                if (!existentes.contains(chave)) {
                    novosVoos.add(voo);
                }
            }

            if (novosVoos.isEmpty()) {
                logger.info("Nenhum voo novo para inserir. Todos já estão no banco.");
            } else {
                logger.info(novosVoos.size() + " voos novos encontrados. Inserindo...");
                try {
                    new VooRepository().salvarVoos(connection, novosVoos);
                    connection.commit();
                    logger.info("Voos novos inseridos com sucesso.");
                } catch (SQLException e) {
                    logger.error("Erro ao salvar voos: " + e.getMessage());
                    try {
                        connection.rollback();
                        logger.warn("Transação revertida (rollback)");
                    } catch (SQLException ex) {
                        logger.error("Erro ao realizar rollback: " + ex.getMessage());
                    }
                }
            }

            logger.info("ETL concluído com sucesso");

        } catch (Exception e) {
            System.err.println("Erro fatal no processo ETL: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
