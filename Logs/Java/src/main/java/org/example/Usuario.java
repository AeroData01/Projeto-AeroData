package org.example;

public class Usuario {

    private String cpf;
    private String nome;
    private String cargo;
    private String email;
    private String senha;

    public Usuario(String cpf, String nome, String cargo, String email, String senha) {
        this.cpf = cpf;
        this.nome = nome;
        this.cargo = cargo;
        this.email = email;
        this.senha = senha;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
