package org.example;

import org.example.db.DBConnectionProvider;
import org.example.excel.LeitorPlanilha;
import org.example.model.Voo;
import org.example.s3.S3Uploader;
import org.example.log.LogService;
import org.example.repository.VooRepository;

import java.io.File;
import java.sql.Connection;
import java.sql.Statement;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        LogService logger = new LogService();

        try {
            logger.info("Inicializando aplicação AeroData...");

            // 1. Lê a planilha de voos
            String caminhoPlanilha = "Base de Dados - AeroData.xlsx";
            List<Voo> voos = LeitorPlanilha.lerVoos(caminhoPlanilha);
            logger.info(voos.size() + " voos lidos da planilha.");

            // 2. Estabelece conexão com o banco e cria estrutura + persiste os dados
            try (Connection conexao = DBConnectionProvider.getConnection()) {
                logger.info("Conexão com o banco H2 estabelecida.");

                // Criação da tabela Voos, se não existir
                try (Statement stmt = conexao.createStatement()) {
                    stmt.execute("""
                        CREATE TABLE IF NOT EXISTS Voos (
                            id IDENTITY PRIMARY KEY,
                            numero_voo VARCHAR(20),
                            dia_referencia DATE,
                            situacao_voo VARCHAR(50),
                            situacao_partida VARCHAR(50),
                            situacao_chegada VARCHAR(50),
                            fk_rota INT,
                            fk_companhia INT
                        )
                    """);
                    logger.info("Tabela 'Voos' verificada/criada com sucesso.");
                }

                // Inserção dos dados
                VooRepository vooRepository = new VooRepository();
                vooRepository.salvarVoos(conexao, voos);
                logger.info("Voos inseridos com sucesso no banco de dados.");
            }

            // 3. Upload da planilha para o bucket S3
//            S3Uploader uploader = new S3Uploader();
//            uploader.uploadArquivo(new File(caminhoPlanilha));
//            logger.info("Planilha enviada ao bucket com sucesso.");

        } catch (Exception e) {
            logger.error("Erro na execução da aplicação: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
