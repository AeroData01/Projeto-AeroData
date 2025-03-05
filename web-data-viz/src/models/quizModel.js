// const { pontos } = require("../controllers/usuarioController");
var database = require("../database/config")

function resultadoQuiz(fkUsuario, acertos, erros) {
    var instrucaoSql = `
    insert into historicoQuiz (fkUsuario, dtJogo, acertos, erros) values
	(${fkUsuario}, current_timestamp(), ${acertos}, ${erros});
    `;

    return database.executar(instrucaoSql);
}

function pontos(fkUsuario) {
    
    var instrucaoSql = `
   select acertos, erros,
	date_format(dtJogo, '%d/%m/%y') as 'data_da_Jogada'
    from historicoQuiz
    where fkUsuario = ${fkUsuario}
    order by dtJogo desc;
    `;

    console.log('Estou na função pontos')
    return database.executar(instrucaoSql);
}

module.exports = {
    resultadoQuiz,
    pontos
};