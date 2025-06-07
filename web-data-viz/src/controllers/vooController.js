var vooModel = require("../models/vooModel");

function listarTop3CompanhiasComMaisAtrasos(req, res) {
    vooModel.listarTop3CompanhiasComMaisAtrasos()
        .then(function (resultado) {
            if (resultado.length >= 1) {
                res.json(resultado);
            } else {
                res.status(204).send("Não foram encontrados dados");
            }
        })
}

function listarCancelamentosMensais(req, res) {
    var nome_fantasia = req.params.nome_fantasia;

    vooModel.listarCancelamentosMensais(nome_fantasia)
        .then(function (resultado) {
            if (resultado.length >= 1) {
                res.json(resultado);
            } else {
                res.status(204).send("Não foram encontrados dados");
            }
        })
}

function listarAtrasosMensais(req, res) {
    var nome_fantasia = req.params.nome_fantasia;

    vooModel.listarAtrasosMensais(nome_fantasia)
        .then(function (resultado) {
            if (resultado.length >= 1) {
                res.json(resultado);
            } else {
                res.status(204).send("Não foram encontrados dados");
            }
        })
}

function listarTotalVoosPorCompanhia(req, res) {
    vooModel.listarTotalVoosPorCompanhia()
        .then(function (resultado) {
            if (resultado.length >= 1) {
                res.json(resultado);
            } else {
                res.status(204).send("Não foram encontrados dados");
            }
        })
}

function listarKpisGerencial(req, res) {
    var nome_fantasia = req.params.nome_fantasia;

    vooModel.listarKpisGerencial(nome_fantasia)
        .then(function (resultado) {
            if (resultado.length >= 1) {
                res.json(resultado);
            } else {
                res.status(204).send("Não foram encontrados dados");
            }
        })
}

function listarMediaAtrasoPorCompanhia(req, res) {
    var nome_fantasia = req.params.nome_fantasia;
    vooModel.listarMediaAtrasoPorCompanhia(nome_fantasia)
        .then(function (resultado) {
            if (resultado.length >= 1) {
                res.json(resultado);
            } else {
                res.status(204).send("Não foram encontrados dados");
            }
        })
}

module.exports = {
    listarTop3CompanhiasComMaisAtrasos,
    listarCancelamentosMensais,
    listarAtrasosMensais,
    listarTotalVoosPorCompanhia,
    listarKpisGerencial,
    listarMediaAtrasoPorCompanhia
}