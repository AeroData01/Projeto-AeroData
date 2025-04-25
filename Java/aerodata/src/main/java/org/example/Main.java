package sptech.school;

import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import org.example.s3.S3Provider;
import org.example.log.LogService;
import org.example.excel.LeitorPlanilha;
import org.example.model.Voo;
import org.example.db.DBConnectionProvider;
import org.example.repository.VooRepository;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.Statement;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        LogService logger = new LogService();
        S3Client s3Client = new S3Provider().getS3Client();
        String bucketName = "nome-do-bucket";
        String key = "Base de Dados - AeroData.xls";  // ou .xlsx
        String localPath = "downloaded-planilha.xls";

        // Download da planilha do S3 para arquivo local
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            InputStream is = s3Client.getObject(getObjectRequest, ResponseTransformer.toInputStream());
            Files.copy(is, new File(localPath).toPath());
            logger.info("Planilha baixada do S3 para: " + localPath);
        } catch (IOException | S3Exception e) {
            logger.error("Erro ao baixar planilha do S3: " + e.getMessage());
            return;
        }

        // Leitura e tratamento da planilha
        List<Voo> voos;
        try {
            voos = LeitorPlanilha.lerVoos(localPath);
            logger.info(voos.size() + " voos lidos da planilha.");
        } catch (Exception e) {
            logger.error("Erro ao ler planilha: " + e.getMessage());
            return;
        }

        // Persistência no banco de dados
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
            VooRepository repo = new VooRepository();
            repo.salvarVoos(conexao, voos);
            logger.info("Voos inseridos com sucesso no banco de dados.");
        } catch (Exception e) {
            logger.error("Erro na persistência de dados: " + e.getMessage());
        }
    }
}
