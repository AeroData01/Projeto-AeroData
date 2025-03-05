var quizModel = require("../models/quizModel");

function resultadoQuiz(req, res) {
    var fkUsuario = req.body.fkUsuarioServer;
    var acertos = req.body.acertosServer;
    var erros = req.body.errosServer;

    // Passe os valores como parâmetro e vá para o arquivo quizModel.js
    quizModel.resultadoQuiz(fkUsuario, acertos, erros)
    .then(
        function (resultado) {
            res.json(resultado);
        }
    ).catch(
        function (erro) {
            console.log(erro);
            console.log(
                "\n Erro QUIZ ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        }
    );

}

function pontos(req, res) {
    var fkUsuario = req.params.fkUsuario;

    // Passe os valores como parâmetro e vá para o arquivo quizModel.js
    quizModel.pontos(fkUsuario)
    .then(
        function (resultado) {
            console.log(resultado)
            res.json(resultado);

        }
    ).catch(
        function (erro) {
            console.log(erro);
            console.log(
                "\n Erro QUIZ ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        }
    );

}

module.exports = {
    resultadoQuiz,
    pontos
}