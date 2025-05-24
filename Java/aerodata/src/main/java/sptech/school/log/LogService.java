package sptech.school.log;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public class LogService {
    private final Connection connection;

    /**
     * Construtor que recebe a conexão do Main para reutilização da mesma transação.
     */
    public LogService(Connection connection) {
        this.connection = connection;
    }

    public void info(String mensagem) {
        String log = String.format("[%s] [INFO] %s", LocalDateTime.now(), mensagem);
        System.out.println(log);
        writeToDB("INFO", mensagem);
    }

    public void warn(String mensagem) {
        String log = String.format("[%s] [WARN] %s", LocalDateTime.now(), mensagem);
        System.out.println(log);
        writeToDB("WARN", mensagem);
    }

    public void error(String mensagem) {
        String log = String.format("[%s] [ERROR] %s", LocalDateTime.now(), mensagem);
        System.err.println(log);
        writeToDB("ERROR", mensagem);
    }

    private void writeToDB(String nivel, String mensagem) {
        String sql = "INSERT INTO LogService (data_hora, nivel, mensagem) VALUES (?, ?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
            ps.setString(2, nivel);
            ps.setString(3, mensagem);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
