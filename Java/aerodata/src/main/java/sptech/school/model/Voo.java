package sptech.school.model;

import java.sql.Date;

/**
 * Classe modelo que representa um voo extraído da planilha e destinado ao banco de dados.
 */
public class Voo {

    private int idVoo;
    private String siglaCompanhia;
    private String nomeCompanhia;
    private String numeroVoo;
    private Date dataReferencia;

    private String siglaAeroportoPartida;
    private String aeroportoPartida;
    private String siglaAeroportoDestino;
    private String aeroportoDestino;

    private String situacaoVoo;
    private String situacaoPartida;
    private String situacaoChegada;
    private String fkCompanhia;

    // Getters e Setters

    public int getIdVoo() {
        return idVoo;
    }

    public void setIdVoo(int idVoo) {
        this.idVoo = idVoo;
    }

    public String getSiglaCompanhia() {
        return siglaCompanhia;
    }

    public void setSiglaCompanhia(String siglaCompanhia) {
        this.siglaCompanhia = siglaCompanhia;
    }

    public String getNomeCompanhia() {
        return nomeCompanhia;
    }

    public void setNomeCompanhia(String nomeCompanhia) {
        this.nomeCompanhia = nomeCompanhia;
    }

    public String getNumeroVoo() {
        return numeroVoo;
    }

    public void setNumeroVoo(String numeroVoo) {
        this.numeroVoo = numeroVoo;
    }

    public Date getDataReferencia() {
        return dataReferencia;
    }

    public void setDataReferencia(Date dataReferencia) {
        this.dataReferencia = dataReferencia;
    }

    public String getSiglaAeroportoPartida() {
        return siglaAeroportoPartida;
    }

    public void setSiglaAeroportoPartida(String siglaAeroportoPartida) {
        this.siglaAeroportoPartida = siglaAeroportoPartida;
    }

    public String getAeroportoPartida() {
        return aeroportoPartida;
    }

    public void setAeroportoPartida(String aeroportoPartida) {
        this.aeroportoPartida = aeroportoPartida;
    }

    public String getSiglaAeroportoDestino() {
        return siglaAeroportoDestino;
    }

    public void setSiglaAeroportoDestino(String siglaAeroportoDestino) {
        this.siglaAeroportoDestino = siglaAeroportoDestino;
    }

    public String getAeroportoDestino() {
        return aeroportoDestino;
    }

    public void setAeroportoDestino(String aeroportoDestino) {
        this.aeroportoDestino = aeroportoDestino;
    }

    public String getSituacaoVoo() {
        return situacaoVoo;
    }

    public void setSituacaoVoo(String situacaoVoo) {
        this.situacaoVoo = situacaoVoo;
    }

    public String getSituacaoPartida() {
        return situacaoPartida;
    }

    public void setSituacaoPartida(String situacaoPartida) {
        this.situacaoPartida = situacaoPartida;
    }

    public String getSituacaoChegada() {
        return situacaoChegada;
    }

    public void setSituacaoChegada(String situacaoChegada) {
        this.situacaoChegada = situacaoChegada;
    }
     public String getFkCompanhia() {
        return fkCompanhia;
    }
    public void setFkCompanhia(String fkCompanhia) {
        this.fkCompanhia = fkCompanhia;
  }
}
