package org.example;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.logging.*;

public class Teste3 {
    private static final Logger logger = Logger.getLogger(Teste3.class.getName());

    public static void main(String[] args) throws InterruptedException {
        // Configuração do Logger
        logger.setUseParentHandlers(false);
        ConsoleHandler handler = new ConsoleHandler();
        handler.setFormatter(new CustomFormatter());
        logger.addHandler(handler);
        logger.setLevel(Level.ALL);

        // Simulação de logs
        String[] messages = {
                "Entering method processOrder().",
                "Received order with ID 12345.",
                "Order shipped successfully.",
                "Potential security vulnerability detected in user input: '...'",
                "Failed to process order. Error: { . . . }",
                "System crashed. Shutting down..."
        };

        String[] levels = { "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL" };

        Random random = new Random();

        while (true) {
            int index = random.nextInt(messages.length);
            int levelIndex = random.nextInt(levels.length);

            logMessage(levels[levelIndex], messages[index]);

            // Espera entre 2 a 4 segundos antes de gerar o próximo log
            Thread.sleep(random.nextInt(2000) + 2000);
        }
    }

    private static void logMessage(String level, String message) {
        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date());
        String formattedMessage = String.format("%s [main] %-5s com.example.App - %s",
                timestamp, level, message);

        System.out.println(colorize(level, formattedMessage));
    }

    private static String colorize(String level, String message) {
        String RESET = "\u001B[0m";
        String TRACE = "\u001B[37m"; // Branco
        String DEBUG = "\u001B[34m"; // Azul
        String INFO = "\u001B[32m"; // Verde
        String WARN = "\u001B[33m"; // Amarelo
        String ERROR = "\u001B[31m"; // Vermelho
        String FATAL = "\u001B[35m"; // Roxo

        switch (level) {
            case "TRACE": return TRACE + message + RESET;
            case "DEBUG": return DEBUG + message + RESET;
            case "INFO": return INFO + message + RESET;
            case "WARN": return WARN + message + RESET;
            case "ERROR": return ERROR + message + RESET;
            case "FATAL": return FATAL + message + RESET;
            default: return message;
        }
    }

    static class CustomFormatter extends Formatter {
        @Override
        public String format(LogRecord record) {
            return record.getMessage() + "\n";
        }
    }
}
