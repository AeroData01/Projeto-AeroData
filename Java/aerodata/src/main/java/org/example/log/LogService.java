package org.example.log;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Serviço de log customizado que imprime mensagens com timestamp e nível.
 */
public class LogService {
    // Formato do timestamp utilizado nos logs
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Método interno para formatar e imprimir a mensagem no console.
     */
    private void log(String level, String message) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        System.out.println("[" + timestamp + "] [" + level + "] " + message);
    }

    public void info(String message) {
        log("INFO", message);
    }

    public void warn(String message) {
        log("WARN", message);
    }

    public void error(String message) {
        log("ERROR", message);
    }

    public void debug(String message) {
        log("DEBUG", message);
    }
}
