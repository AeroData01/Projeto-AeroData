package org.example;
import java.text.SimpleDateFormat; // Para formatar a data e horário do log
import java.util.Date; // Para obter a data atual
import java.util.Random; // Para gerar logs aleatórios

public class Logs {
    public static void main(String[] args) throws InterruptedException {
        // Lista de logs com pares fixos de nível e mensagem correspondente
        String[][] logEntries = {
                {"TRACE", "Entering method processOrder()."},
                {"DEBUG", "Received order with ID 12345."},
                {"INFO", "Order shipped successfully."},
                {"WARN", "Potential security vulnerability detected in user input: '...'"},
                {"ERROR", "Failed to process order. Error: { . . . }"},
                {"FATAL", "System crashed. Shutting down..."}
        };

        Random random = new Random(); // Criando um gerador de números aleatórios

        while (true) { // Loop infinito para gerar logs continuamente
            int index = random.nextInt(logEntries.length); // Escolhe um log aleatório
            String level = logEntries[index][0]; // Obtém o nível do log
            String message = logEntries[index][1]; // Obtém a mensagem correspondente

            logMessage(level, message); // Chama a função para exibir o log formatado

            // Se o nível for ERROR ou FATAL, encerra o programa imediatamente
            if (level.equals("ERROR") || level.equals("FATAL")) {
                System.exit(1);
            }

            // Pausa de 2 a 4 segundos antes de gerar o próximo log (simula um sistema real)
            Thread.sleep(random.nextInt(2000) + 2000);
        }
    }

    // Método para exibir o log formatado no console
    private static void logMessage(String level, String message) {
        // Obtém a data e horário atual no formato "YYYY-MM-DD HH:mm:ss.SSS"
        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date());

        // Formata a mensagem no estilo esperado: "2023-04-25 21:22:23.944 [main] INFO com.example.App - Mensagem"
        String formattedMessage = String.format("%s [main] %-5s com.example.App - %s",
                timestamp, level, message);

        // Exibe a mensagem colorida conforme o nível do log
        System.out.println(colorize(level, formattedMessage));
    }

    // Método para aplicar cores ANSI no terminal
    private static String colorize(String level, String message) {
        // Códigos ANSI para cores no terminal (funciona na maioria dos terminais Unix/Linux/macOS e no Windows com suporte)
        String RESET = "\u001B[0m"; // Resetar a cor para padrão
        String TRACE = "\u001B[37m"; // Branco
        String DEBUG = "\u001B[34m"; // Azul
        String INFO = "\u001B[32m"; // Verde
        String WARN = "\u001B[33m"; // Amarelo
        String ERROR = "\u001B[31m"; // Vermelho
        String FATAL = "\u001B[35m"; // Roxo

        // Retorna a mensagem com a cor correspondente ao nível de log
        switch (level) {
            case "TRACE": return TRACE + message + RESET;
            case "DEBUG": return DEBUG + message + RESET;
            case "INFO": return INFO + message + RESET;
            case "WARN": return WARN + message + RESET;
            case "ERROR": return ERROR + message + RESET;
            case "FATAL": return FATAL + message + RESET;
            default: return message; // Caso o nível não exista, retorna sem cor
        }
    }
}
