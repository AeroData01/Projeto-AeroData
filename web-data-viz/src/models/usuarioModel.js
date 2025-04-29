var database = require("../database/config");

// HASH DE SENHA
const crypto = require('crypto');

function gerarHash(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}

function autenticar(email, senha) {  // <-- Aqui troquei "senhaHash" por "senha"
    const senhaHash = gerarHash(senha);  // <-- Você esqueceu de gerar o hash aqui.

    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha);
    
    var instrucaoSql = `
        SELECT cpf, email, cargo FROM Usuario WHERE email = '${email}' AND senha = '${senhaHash}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, cpf, email, telefone, tipoConta, tipoCompanhia, senha) {
    const senhaHash = gerarHash(senha);

    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);
    
    var instrucaoSql = `
        INSERT INTO Usuario (cpf, nome, cargo, email, senha, telefone, fk_companhia) VALUES 
            ('${cpf}', '${nome}', '${tipoConta}', '${email}', '${senhaHash}', '${telefone}', ${tipoCompanhia});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};