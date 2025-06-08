var database = require("../database/config");

function cadastrar(cpf, dataObservacao, descricaoObservacao) {    
    var instrucaoSql = `
        INSERT INTO Observacao (data_observacao, descricao, fk_usuario) VALUES 
            ('${dataObservacao}', '${descricaoObservacao}', '${cpf}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarObservacao(cpf) {
    var instrucaoSql = `
        SELECT o.data_observacao, o.descricao, o.id_observacao
        FROM Observacao o 
        WHERE o.fk_usuario = '${cpf}'
    ;`

    return database.executar(instrucaoSql);
}

function excluirObservacao(idObservacao) {
    var instrucaoSql = `
    DELETE FROM Observacao
    WHERE id_observacao = ${idObservacao}
    ;`

    return database.executar(instrucaoSql);
}

function atualizarObservacao(idObservacao, descricao, dtObservacao) {
    var instrucaoSql = `
    UPDATE Observacao SET data_observacao = '${dtObservacao}', descricao = '${descricao}' 
    WHERE id_observacao = ${idObservacao}
    ;`

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listarObservacao,
    excluirObservacao,
    atualizarObservacao
};
