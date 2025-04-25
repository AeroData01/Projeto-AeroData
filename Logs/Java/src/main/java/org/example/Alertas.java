package org.example;

import java.time.LocalDateTime;

public class Alertas {

    private String idAlerta;
    private LocalDateTime dataHora;
    private String tipo;
    private String mensagem;

    public Alertas(String idAlerta, LocalDateTime dataHora, String tipo, String mensagem) {
        this.idAlerta = idAlerta;
        this.dataHora = dataHora;
        this.tipo = tipo;
        this.mensagem = mensagem;
    }

    public String getIdAlerta() {
        return idAlerta;
    }

    public void setIdAlerta(String idAlerta) {
        this.idAlerta = idAlerta;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
