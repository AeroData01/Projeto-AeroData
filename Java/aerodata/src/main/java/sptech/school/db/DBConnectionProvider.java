package sptech.school.db;

import java.sql.Connection;
import java.sql.DriverManager;

/**
 * Fornecedor de conexão com banco de dados H2 em memória usando JDBC.
 */
public class DBConnectionProvider {

    // URL de conexão com banco H2 em memória
    private static final String URL = "jdbc:mysql://localhost:3306/aerodata";

    // Usuário padrão do H2
    private static final String USUARIO = "root";

    // Senha padrão do H2 (vazia por padrão)
    private static final String SENHA = "urubu100";

    /**
     * Retorna uma conexão válida com o banco de dados H2.
     * @return conexão JDBC com o banco
     * @throws Exception em caso de falha de conexão
     */
    public static Connection getConnection() throws Exception {
        return DriverManager.getConnection(URL, USUARIO, SENHA);
    }
}
