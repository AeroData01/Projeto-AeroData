package org.example.db;

import java.sql.Connection;
import java.sql.DriverManager;

/**
 * Fornecedor de conexão com banco de dados H2 em memória usando JDBC.
 */
public class DBConnectionProvider {

    // URL de conexão com banco H2 em memória
    private static final String URL = "jdbc:h2:mem:aerodata;DB_CLOSE_DELAY=-1";

    // Usuário padrão do H2
    private static final String USUARIO = "sa";

    // Senha padrão do H2 (vazia por padrão)
    private static final String SENHA = "";

    /**
     * Retorna uma conexão válida com o banco de dados H2.
     * @return conexão JDBC com o banco
     * @throws Exception em caso de falha de conexão
     */
    public static Connection getConnection() throws Exception {
        return DriverManager.getConnection(URL, USUARIO, SENHA);
    }
}
