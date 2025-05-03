package sptech.school;

import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import sptech.school.s3.S3Provider;
import sptech.school.log.LogService;
import sptech.school.excel.LeitorPlanilha;
import sptech.school.model.Voo;
import sptech.school.db.DBConnectionProvider;
import sptech.school.repository.VooRepository;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.Statement;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        LogService logger = new LogService();
        S3Client s3Client = new S3Provider().getS3Client();
        String bucketName = "aero-data-bucket";
        String localPath = "downloaded-planilha.xlsx";
        String expectedKeyName = "Base_Aerodata (definitivo).xlsx";

        try {
            ListObjectsV2Request listReq = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build();
            ListObjectsV2Response listRes = s3Client.listObjectsV2(listReq);

            logger.info("Conteúdo do bucket '" + bucketName + "':");
            for (S3Object obj : listRes.contents()) {
                logger.info("  - " + obj.key());
            }

            String key = listRes.contents().stream()
                    .map(S3Object::key)
                    .filter(k -> k.equals(expectedKeyName))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Arquivo '" + expectedKeyName + "' não encontrado no bucket"));

            logger.info("Usando a key para download: " + key);

            GetObjectRequest getReq = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            try (InputStream is = s3Client.getObject(getReq, ResponseTransformer.toInputStream())) {
                Files.copy(is, Paths.get(localPath));
                logger.info("Planilha baixada do S3 para: " + localPath);
            }
        } catch (IOException | S3Exception e) {
            logger.error("Erro ao baixar planilha do S3: " + e.getMessage());
            return;
        }

        List<Voo> voos;
        try {
            voos = LeitorPlanilha.lerVoos(localPath);
            logger.info(voos.size() + " voos lidos da planilha.");
        } catch (Exception e) {
            logger.error("Erro ao ler planilha: " + e.getMessage());
            return;
        }


        // Persistência no banco
        try (Connection conexao = DBConnectionProvider.getConnection()) {
            logger.info("Conexão com o banco estabelecida.");
            try (Statement stmt = conexao.createStatement()) {
                stmt.execute("""
                    CREATE TABLE IF NOT EXISTS Voos (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        numero_voo VARCHAR(20),
                        dia_referencia DATE,
                        aeroporto_partida VARCHAR(255),
                        sigla_aeroporto_partida VARCHAR(10),
                        aeroporto_destino VARCHAR(255),
                        sigla_aeroporto_destino VARCHAR(10),
                        situacao_voo VARCHAR(50),
                        situacao_partida VARCHAR(50),
                        situacao_chegada VARCHAR(50),
                        fk_companhia INT
                    )
                """);
                logger.info("Tabela 'Voos' verificada/criada com sucesso.");
            }
            new VooRepository().salvarVoos(conexao, voos);
            logger.info("Voos inseridos com sucesso no banco de dados.");
        } catch (Exception e) {
            logger.error("Erro na persistência de dados: " + e.getMessage());
        }
    }
}
