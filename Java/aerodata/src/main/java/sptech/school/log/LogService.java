package sptech.school.log;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LogService {

    private final Connection connection;

    private static final DateTimeFormatter TS_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public LogService(Connection connection) {
        this.connection = connection;
    }

    public void info(String mensagem) {
        String now = LocalDateTime.now().format(TS_FMT);
        String log = String.format("[%s] [INFO]  %s", now, mensagem);
        System.out.println(log);
        writeToDB("INFO", mensagem);
    }

    public void warn(String mensagem) {
        String now = LocalDateTime.now().format(TS_FMT);
        String log = String.format("[%s] [WARN]  %s", now, mensagem);
        System.out.println(log);
        writeToDB("WARN", mensagem);
    }

    public void error(String mensagem) {
        String now = LocalDateTime.now().format(TS_FMT);
        String log = String.format("[%s] [ERROR] %s", now, mensagem);
        System.err.println(log);
        writeToDB("ERROR", mensagem);
    }

    private void writeToDB(String nivel, String mensagem) {
        String sql = "INSERT INTO log_service (data_hora, nivel, mensagem) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            Timestamp ts = Timestamp.valueOf(LocalDateTime.now().withNano(0));
            stmt.setTimestamp(1, ts);
            stmt.setString(2, nivel);
            stmt.setString(3, mensagem);
            stmt.executeUpdate();
        } catch (SQLException e) {
            // Caso falhe a gravação em banco, pelo menos mostra no stderr
            e.printStackTrace();
        }
    }
}
