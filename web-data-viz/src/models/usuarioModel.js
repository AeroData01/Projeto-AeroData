var database = require("../database/config");

function autenticar(email, senha) { 
    var instrucaoSql = `
        SELECT u.nome, u.cpf, u.email, u.cargo, c.nome_fantasia AS companhia 
        FROM Usuario u
        JOIN Companhia_Aerea c
            ON c.sigla_companhia = u.fk_sigla_companhia
        WHERE email = '${email}' AND senha = MD5('${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticarAdmin(email, senha) { 
    var instrucaoSql = `
        SELECT u.nome, u.cpf, u.email, u.cargo
        FROM Usuario u
        WHERE email = '${email}' AND senha = MD5('${senha}') AND cargo = 'admin';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, cpf, email, telefone, tipoConta, tipoCompanhia, senha) {
    var instrucaoSql = `
        INSERT INTO Usuario (cpf, nome, cargo, email, senha, telefone, fk_sigla_companhia) VALUES 
            ('${cpf}', '${nome}', '${tipoConta}', '${email}', MD5('${senha}'), '${telefone}', '${tipoCompanhia}');
    `;

    return database.executar(instrucaoSql);
}

function listarFuncionario(tipoCompanhia) {
    var instrucaoSql = `
        SELECT u.cpf, u.nome, u.email, u.cargo, c.nome_fantasia 
        FROM Usuario u
        JOIN Companhia_Aerea c
            ON c.sigla_companhia = u.fk_sigla_companhia 
        WHERE cargo LIKE "operacional" AND u.fk_sigla_companhia LIKE '${tipoCompanhia}'
    ;`

    return database.executar(instrucaoSql);
}

function excluirFuncionario(cpf) {
    var instrucaoSql = `
    DELETE FROM Usuario
    WHERE cpf = '${cpf}'
    ;`

    return database.executar(instrucaoSql);
}

function atualizarFuncionario(nome, email, cpf) {
    var instrucaoSql = `
    UPDATE Usuario SET nome = '${nome}', email = '${email}' 
    WHERE cpf = '${cpf}'
    ;`

    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    autenticarAdmin,
    cadastrar,
    listarFuncionario,
    excluirFuncionario,
    atualizarFuncionario
};
