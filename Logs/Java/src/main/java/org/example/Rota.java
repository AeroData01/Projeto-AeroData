package org.example;

public class Rota {

    private String idRota;
    private String aeroportoOrigem;
    private String siglaAeroportoOrigem;
    private String aeroportoDestino;
    private String siglaAeroportoDestino;

    public Rota(String idRota, String aeroportoOrigem, String siglaAeroportoOrigem, String aeroportoDestino, String siglaAeroportoDestino) {
        this.idRota = idRota;
        this.aeroportoOrigem = aeroportoOrigem;
        this.siglaAeroportoOrigem = siglaAeroportoOrigem;
        this.aeroportoDestino = aeroportoDestino;
        this.siglaAeroportoDestino = siglaAeroportoDestino;
    }

    public String getIdRota() {
        return idRota;
    }

    public void setIdRota(String idRota) {
        this.idRota = idRota;
    }

    public String getAeroportoOrigem() {
        return aeroportoOrigem;
    }

    public void setAeroportoOrigem(String aeroportoOrigem) {
        this.aeroportoOrigem = aeroportoOrigem;
    }

    public String getSiglaAeroportoOrigem() {
        return siglaAeroportoOrigem;
    }

    public void setSiglaAeroportoOrigem(String siglaAeroportoOrigem) {
        this.siglaAeroportoOrigem = siglaAeroportoOrigem;
    }

    public String getAeroportoDestino() {
        return aeroportoDestino;
    }

    public void setAeroportoDestino(String aeroportoDestino) {
        this.aeroportoDestino = aeroportoDestino;
    }

    public String getSiglaAeroportoDestino() {
        return siglaAeroportoDestino;
    }

    public void setSiglaAeroportoDestino(String siglaAeroportoDestino) {
        this.siglaAeroportoDestino = siglaAeroportoDestino;
    }
}
