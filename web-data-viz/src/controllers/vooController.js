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


module.exports = {
    listarTop3CompanhiasComMaisAtrasos,
    listarCancelamentosMensais
}