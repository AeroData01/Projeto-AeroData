var kpi1Model = require("../models/kpi1Model");

function listar(req, res) {
    var fkUsuario = req.params.fkUsuario;
    console.log(fkUsuario)
    
    kpi1Model.listar(fkUsuario).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    listar
}