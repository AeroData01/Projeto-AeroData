var database = require("../database/config");

function listarMIN(fkUsuario) {
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");
    var instrucaoSql = `
    select 
    truncate((SUM(h.erros) / (SUM(h.acertos) + SUM(h.erros))) * 100, 2) as porcentagem_erros
	from usuario as u
	join historicoQuiz as h 
    on u.idUsuario = h.fkUsuario
	where u.idUsuario = ${fkUsuario}; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarMIN
}
