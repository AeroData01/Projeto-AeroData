package org.example;

public class CompanhiaAerea {

    private String cnpj;
    private String nomeFantasia;
    private String siglaCompanhia;

    public CompanhiaAerea(String cnpj, String nomeFantasia, String siglaCompanhia) {
        this.cnpj = cnpj;
        this.nomeFantasia = nomeFantasia;
        this.siglaCompanhia = siglaCompanhia;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getSiglaCompanhia() {
        return siglaCompanhia;
    }

    public void setSiglaCompanhia(String siglaCompanhia) {
        this.siglaCompanhia = siglaCompanhia;
    }
}
