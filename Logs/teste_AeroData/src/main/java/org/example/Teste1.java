import java.util.logging.*;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class Teste1 {
    private static final Logger logger = Logger.getLogger(Teste1.class.getName());

    public static void main(String[] args) throws InterruptedException {
        // Configuração básica do Logger
        ConsoleHandler handler = new ConsoleHandler();
        handler.setFormatter(new SimpleFormatter());
        logger.addHandler(handler);
        logger.setUseParentHandlers(false);
        logger.setLevel(Level.ALL);

        String[] messages = {
                "User logged in successfully.",
                "Database connection established.",
                "Order #12345 processed successfully.",
                "Payment failed due to insufficient funds.",
                "Potential security threat detected!",
                "System running smoothly.",
                "Failed to load configuration file.",
                "User session expired.",
                "Background job executed successfully."
        };

        Level[] levels = { Level.INFO, Level.WARNING, Level.SEVERE, Level.CONFIG, Level.FINE };

        Random random = new Random();

        // Loop infinito para gerar logs dinâmicos
        while (true) {
            int index = random.nextInt(messages.length);
            int levelIndex = random.nextInt(levels.length);

            // Log com nível e mensagem aleatória
            logger.log(levels[levelIndex], messages[index]);

            // Espera alguns segundos antes de gerar o próximo log
            TimeUnit.SECONDS.sleep(random.nextInt(3) + 2);
        }
    }
}
