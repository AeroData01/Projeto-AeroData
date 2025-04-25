package org.example;

import java.util.Date;

public class Voos {

    private String numeroVoo;
    private Date diaReferencia;
    private String situacaovoo;
    private String situacaoPartida;
    private String getSituacaoChegada;

    public Voos(String numeroVoo, Date diaReferencia, String situacaovoo, String situacaoPartida, String getSituacaoChegada) {
        this.numeroVoo = numeroVoo;
        this.diaReferencia = diaReferencia;
        this.situacaovoo = situacaovoo;
        this.situacaoPartida = situacaoPartida;
        this.getSituacaoChegada = getSituacaoChegada;
    }

    public String getNumeroVoo() {
        return numeroVoo;
    }

    public void setNumeroVoo(String numeroVoo) {
        this.numeroVoo = numeroVoo;
    }

    public Date getDiaReferencia() {
        return diaReferencia;
    }

    public void setDiaReferencia(Date diaReferencia) {
        this.diaReferencia = diaReferencia;
    }

    public String getSituacaovoo() {
        return situacaovoo;
    }

    public void setSituacaovoo(String situacaovoo) {
        this.situacaovoo = situacaovoo;
    }

    public String getSituacaoPartida() {
        return situacaoPartida;
    }

    public void setSituacaoPartida(String situacaoPartida) {
        this.situacaoPartida = situacaoPartida;
    }

    public String getGetSituacaoChegada() {
        return getSituacaoChegada;
    }

    public void setGetSituacaoChegada(String getSituacaoChegada) {
        this.getSituacaoChegada = getSituacaoChegada;
    }
}
