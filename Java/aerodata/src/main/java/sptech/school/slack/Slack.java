package sptech.school.slack;

import org.json.JSONObject;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Slack {
    private static final HttpClient client = HttpClient.newHttpClient();

    //  URL real do seu Webhook gerado pelo Slack
   private static final String url = System.getenv("SLACK_WEBHOOK_URL");


  public static void enviarMensagem(String mensagem) throws IOException, InterruptedException {
    JSONObject json = new JSONObject();
    json.put("text", mensagem);

    HttpRequest request = HttpRequest.newBuilder(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
            .build();

    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

    System.out.println("📤 Slack: Mensagem enviada -> " + mensagem);
    System.out.println("📨 Slack: Status " + response.statusCode() + " - " + response.body());
}

}
