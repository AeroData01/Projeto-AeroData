package sptech.school;

import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.S3Exception;
import sptech.school.s3.S3Provider;
import sptech.school.log.LogService;
import sptech.school.excel.LeitorPlanilha;
import sptech.school.model.Voo;
import sptech.school.db.DBConnectionProvider;
import sptech.school.repository.VooRepository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        LogService logger = new LogService();
        S3Client s3Client = new S3Provider().getS3Client();

        String bucketName = "aero-data-bucket";
        String key        = "Base_Aerodata (definitivo).xlsx";  // ou .xlsx
        String localPath  = "downloaded-planilha.xlsx";

        // 1) Verifica se o bucket existe
        try {
            s3Client.headBucket(HeadBucketRequest.builder()
                .bucket(bucketName).build());
        } catch (NoSuchBucketException e) {
            logger.error("Bucket não existe: " + bucketName);
            return;
        } catch (S3Exception e) {
            logger.error("Erro ao verificar bucket: " + e.getMessage());
            return;
        }

        // 2) Download da planilha (se ainda não existir)
        if (Files.exists(Paths.get(localPath))) {
            logger.info("Arquivo já existe localmente, pulando download: " + localPath);
        } else {
            try {
                GetObjectRequest getReq = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

                InputStream is = s3Client.getObject(getReq, ResponseTransformer.toInputStream());
                Files.copy(is, Paths.get(localPath));
                logger.info("Planilha baixada do S3 para: " + localPath);
            } catch (IOException | S3Exception e) {
                logger.error("Erro ao baixar planilha do S3: " + e.getMessage());
                return;
            }
        }

        // 3) Leitura e tratamento da planilha
        List<Voo> voos;
        try {
            voos = LeitorPlanilha.lerVoos(localPath);
            logger.info(voos.size() + " voos lidos da planilha.");
        } catch (Exception e) {
            logger.error("Erro ao ler planilha: " + e.getMessage());
            return;
        }

        // 4) Persistência no banco de dados, inserindo apenas voos novos
        try (Connection conexao = DBConnectionProvider.getConnection()) {
            logger.info("Conexão com o banco estabelecida.");

            // Cria tabela se necessário
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

            // Carrega chaves existentes (numero_voo|dia_referencia)
            Set<String> existentes = new HashSet<>();
            try (PreparedStatement ps = conexao.prepareStatement(
                     "SELECT numero_voo, dia_referencia FROM Voos");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String numero = rs.getString("numero_voo");
                    Date data     = rs.getDate("dia_referencia");
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
                new VooRepository().salvarVoos(conexao, novosVoos);
                logger.info("Voos novos inseridos com sucesso.");
            }

        } catch (Exception e) {
            logger.error("Erro na persistência de dados: " + e.getMessage());
            return;
        }

        // 5) Só agora, se tudo deu certo:
        logger.info("✅ ETL concluído com sucesso!");
    }
}
