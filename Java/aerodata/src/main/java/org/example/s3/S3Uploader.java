package org.example.s3;

import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.nio.file.Paths;

/**
 * Classe que fornece o cliente S3 configurado com credenciais temporárias da AWS.
 */
public class S3Uploader {

    private final AwsSessionCredentials credentials;

    public S3Uploader() {
        // Carregando credenciais da AWS via variáveis de ambiente
        this.credentials = AwsSessionCredentials.create(
                System.getenv("AWS_ACCESS_KEY_ID"),
                System.getenv("AWS_SECRET_ACCESS_KEY"),
                System.getenv("AWS_SESSION_TOKEN")
        );

        // Verificando se as credenciais foram corretamente carregadas
        if (this.credentials.accessKeyId() == null || this.credentials.secretAccessKey() == null) {
            throw new IllegalStateException("AWS credentials are not set correctly.");
        }
    }

    /**
     * Retorna o cliente S3 configurado com as credenciais.
     */
    public S3Client getS3Client() {
        return S3Client.builder()
                .region(Region.US_EAST_1)  // Região configurada
                .credentialsProvider(() -> credentials)
                .build();
    }

    /**
     * Faz o upload de um arquivo para o S3.
     */
    public void uploadArquivo(File file) {
        S3Client s3Client = getS3Client();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket("seu-nome-do-bucket")  // Nome do bucket
                .key(file.getName())  // Nome do arquivo no S3
                .build();

        s3Client.putObject(putObjectRequest, file.toPath());
    }

    /**
     * Baixa um arquivo do S3 para o sistema local.
     * @param s3Bucket Nome do bucket no S3
     * @param s3Key Nome do arquivo no S3
     * @param destinationFile Caminho local onde o arquivo será salvo
     */
    public void downloadArquivo(String s3Bucket, String s3Key, String destinationFile) {
        S3Client s3Client = getS3Client();

        // Preparando a requisição para baixar o arquivo
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(s3Bucket)
                .key(s3Key)
                .build();

        // Baixando o arquivo e salvando localmente
        s3Client.getObject(getObjectRequest, Paths.get(destinationFile));
    }
}
