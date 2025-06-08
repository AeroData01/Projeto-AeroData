var feedbackModel = require("../models/feedbackModel");

function cadastrar(req, res) {
    var nota = req.body.notaServer;
    var informacao = req.body.informacaoServer;
    var fkCriador = req.body.fkCriadorServer;

    if (nota == undefined || nota < 0 || nota > 10) {
        res.status(400).send("Seu nota está indefinido!");
    } else if (informacao == undefined) {
        res.status(400).send("Seu informacao está indefinido!");
    } else if (fkCriador == undefined) {
        res.status(400).send("Seu fkCriador está indefinido!");
    } else {
        feedbackModel.cadastrar(nota, informacao, fkCriador)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function listarFeedback(req, res) {
    feedbackModel.listarFeedback()
        .then(
            function (resultadoLista) {
                if (resultadoLista.length > 0) {
                    res.json(resultadoLista);
                } else {
                    res.status(204).send("Não tem nenhum feedback!")
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao listar os feedbacks! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function listarFeedbackPorCriador(req, res) {
    var fkCriador = req.params.fkCriador;

    feedbackModel.listarFeedbackPorCriador(fkCriador)
        .then(
            function (resultadoLista) {
                if (resultadoLista.length > 0) {
                    res.json(resultadoLista);
                } else {
                    res.status(204).send("Não tem nenhum feedback!")
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao listar os feedbacks! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function excluirFeedback(req, res) {
    var idFeedback = req.body.idFeedbackServer;

    feedbackModel.excluirFeedback(idFeedback)
    .then(
        function (resultadoExclusao) {
            res.json(resultadoExclusao);    
        }
    ).catch(
        function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao excluir o feedback! Erro: ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        }
    );

}

function atualizarFeedback(req, res) {
    var nota = req.body.nota;
    var informacao = req.body.informacao;
    var idFeedback = req.body.idFeedbackServer;

    feedbackModel.atualizarFeedback(nota, informacao, idFeedback)
    .then(
        function (resultadoUpdate) {
            res.json(resultadoUpdate);
        }
    ).catch(
        function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao editar o feedback! Erro: ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        }
    );
}

module.exports = {
    cadastrar,
    listarFeedback,
    listarFeedbackPorCriador,
    excluirFeedback,
    atualizarFeedback
}