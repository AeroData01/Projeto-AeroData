var anotacaoModel = require("../models/anotacaoModel");

function cadastrar(req, res) {
    var cpf = req.body.cpfServer;
    var dataObservacao = req.body.dataObservacao;
    var descricaoObservacao = req.body.descricaoObservacao;

    if (cpf == undefined) {
        res.status(400).send("Seu cpf está indefinido!");
    } else if (dataObservacao == undefined) {
        res.status(400).send("Seu dataObservacao está indefinido!");
    } else if (descricaoObservacao == undefined) {
        res.status(400).send("Seu descricaoObservacao está indefinido!");
    } else {
        anotacaoModel.cadastrar(cpf, dataObservacao, descricaoObservacao)
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

function listarObservacao(req, res) {

    var cpf = req.body.cpfServer;

    anotacaoModel.listarObservacao(cpf)
        .then(
            function (resultadoLista) {
                if (resultadoLista.length > 0) {
                    res.json(resultadoLista);
                } else {
                    res.status(204).send("Não tem nenhuma observação!")
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao listar as observações! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function excluirObservacao(req, res) {
    var idObservacao = req.body.idObservacaoServer;

    anotacaoModel.excluirObservacao(idObservacao)
        .then(
            function (resultadoExclusao) {
                res.json(resultadoExclusao);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao excluir a observação! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );

}

function atualizarObservacao(req, res) {
    var idObservacao = req.body.idObservacao;
    var descricao = req.body.descricao;
    var dtObservacao = req.body.dtObservacaoServer;

    anotacaoModel.atualizarObservacao(idObservacao, descricao, dtObservacao)
        .then(
            function (resultadoUpdate) {
                res.json(resultadoUpdate);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao editar a observação! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    cadastrar,
    listarObservacao,
    excluirObservacao,
    atualizarObservacao
}