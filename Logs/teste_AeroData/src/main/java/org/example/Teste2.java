package org.example;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Teste2 {
    private static final Logger logger = Logger.getLogger(Teste2.class.getName());

    public static void main(String[] args) {
        logger.setLevel(Level.ALL); // Define o nível de log a ser exibido

        logger.finest("Entering method processOrder()."); // TRACE equivalente
        logger.fine("Received order with ID 12345."); // DEBUG equivalente
        logger.info("Order shipped successfully."); // INFO equivalente
        logger.warning("Potential security vulnerability detected in user input: '...'"); // WARN equivalente
        logger.severe("Failed to process order. Error: { ... }"); // ERROR equivalente
        logger.severe("System crashed. Shutting down..."); // FATAL equivalente
    }
}
