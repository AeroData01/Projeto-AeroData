package org.example.model;

import java.util.Date;

/**
 * Classe modelo que representa um voo extraído da planilha e destinado ao banco de dados.
 */
public class Voo {
    private String siglaCompanhia;
    private String nomeCompanhia;
    private String numeroVoo;
    private String aeroportoOrigem;
    private String aeroportoDestino;
    private Date dataReferencia;
    private String situacaoVoo;
    private String situacaoPartida;
    private String situacaoChegada;

    // Getters e Setters
    public String getSiglaCompanhia() { return siglaCompanhia; }
    public void setSiglaCompanhia(String siglaCompanhia) { this.siglaCompanhia = siglaCompanhia; }

    public String getNomeCompanhia() { return nomeCompanhia; }
    public void setNomeCompanhia(String nomeCompanhia) { this.nomeCompanhia = nomeCompanhia; }

    public String getNumeroVoo() { return numeroVoo; }
    public void setNumeroVoo(String numeroVoo) { this.numeroVoo = numeroVoo; }

    public String getAeroportoOrigem() { return aeroportoOrigem; }
    public void setAeroportoOrigem(String aeroportoOrigem) { this.aeroportoOrigem = aeroportoOrigem; }

    public String getAeroportoDestino() { return aeroportoDestino; }
    public void setAeroportoDestino(String aeroportoDestino) { this.aeroportoDestino = aeroportoDestino; }

    public Date getDataReferencia() { return dataReferencia; }
    public void setDataReferencia(Date dataReferencia) { this.dataReferencia = dataReferencia; }

    public String getSituacaoVoo() { return situacaoVoo; }
    public void setSituacaoVoo(String situacaoVoo) { this.situacaoVoo = situacaoVoo; }

    public String getSituacaoPartida() { return situacaoPartida; }
    public void setSituacaoPartida(String situacaoPartida) { this.situacaoPartida = situacaoPartida; }

    public String getSituacaoChegada() { return situacaoChegada; }
    public void setSituacaoChegada(String situacaoChegada) { this.situacaoChegada = situacaoChegada; }
}
