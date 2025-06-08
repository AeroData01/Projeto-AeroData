var database = require("../database/config");

function cadastrar(nota, informacao, fkCriador) {
    var instrucaoSql = `
        INSERT INTO Feedback (nota, informacao, fk_criador) VALUES 
            ('${nota}', '${informacao}', '${fkCriador}');
    `;

    return database.executar(instrucaoSql);
}

function listarFeedback() {
    var instrucaoSql = `
        SELECT u.nome, f.nota, f.informacao, f.id_feedback, u.email
        FROM Feedback f
        JOIN Usuario u
            ON u.cpf = f.fk_criador;`

    return database.executar(instrucaoSql);
}

function listarFeedbackPorCriador(fkCriador) {
    var instrucaoSql = `
        SELECT u.nome, f.nota, f.informacao, f.id_feedback
        FROM Feedback f
        JOIN Usuario u
            ON u.cpf = f.fk_criador
            WHERE fk_criador = '${fkCriador}';`

    return database.executar(instrucaoSql);
}

function excluirFeedback(idFeedback) {
    var instrucaoSql = `
    DELETE FROM Feedback
    WHERE id_feedback = ${idFeedback}
    ;`

    return database.executar(instrucaoSql);
}

function atualizarFeedback(nota, informacao, idFeedback) {
    var instrucaoSql = `
    UPDATE Feedback SET nota = '${nota}', informacao = '${informacao}' 
    WHERE id_feedback = ${idFeedback}
    ;`

    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listarFeedback,
    listarFeedbackPorCriador,
    excluirFeedback,
    atualizarFeedback
};
