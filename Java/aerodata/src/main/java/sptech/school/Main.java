package sptech.school;

import sptech.school.db.DBConnectionProvider;
import sptech.school.log.LogService;
import sptech.school.excel.LeitorPlanilha;
import sptech.school.model.Voo;
import sptech.school.repository.VooRepository;
import sptech.school.s3.S3Provider;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.S3Exception;
import org.apache.poi.util.IOUtils;


import java.io.File;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        IOUtils.setByteArrayMaxOverride(105_000_000);
        // Inicializa conexão e transação
        try (Connection connection = new DBConnectionProvider().getConnection()) {
            connection.setAutoCommit(false);
            LogService logger = new LogService(connection);

            logger.info("Iniciando ETL do AeroData");

            // Configurações do S3
            S3Client s3 = new S3Provider().getS3Client();
            String bucket = "aero-data-bucket";
            String key = "Base de Dados - AeroData.xlsx";
            Path downloadPath = new File("downloaded-planilha.xlsx").toPath();

            // Valida bucket
            try {
                logger.info("Validando bucket: " + bucket);
                s3.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
            } catch (NoSuchBucketException e) {
                logger.error("Bucket não encontrado: " + bucket);
                return;
            } catch (S3Exception e) {
                logger.error("Erro ao validar bucket: " + e.getMessage());
                return;
            }

            // Download da planilha
            try {
                logger.info("Baixando planilha: " + key);
                s3.getObject(
                        GetObjectRequest.builder().bucket(bucket).key(key).build(),
                        downloadPath
                );
                logger.info("Planilha baixada em: " + downloadPath);
            } catch (S3Exception e) {
                logger.error("Erro no download da planilha: " + e.getMessage());
                return;
            }

            // Leitura da planilha
            logger.info("Lendo planilha...");
            List<Voo> voos = new LeitorPlanilha().lerVoos(downloadPath.toString());
            logger.info("Total de voos lidos: " + voos.size());

            // Persistência dos dados
            VooRepository repo = new VooRepository();
            try {
                logger.info("Persistindo voos no banco...");
                repo.salvarVoos(connection, voos);
                connection.commit();
                logger.info("Voos persistidos com sucesso");
            } catch (SQLException e) {
                logger.error("Erro ao salvar voos: " + e.getMessage());
                try {
                    connection.rollback();
                    logger.warn("Transação revertida (rollback)");
                } catch (SQLException ex) {
                    logger.error("Erro no rollback: " + ex.getMessage());
                }
            }

            logger.info("ETL concluído com sucesso");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
