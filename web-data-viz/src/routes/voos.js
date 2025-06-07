var express = require("express");
var router = express.Router();

var vooController = require("../controllers/vooController");

router.get("/listarTop3CompanhiasComMaisAtrasos", function (req, res) {
    vooController.listarTop3CompanhiasComMaisAtrasos(req, res);
});

router.get("/listarCancelamentosMensais/:nome_fantasia", function (req, res) {
    vooController.listarCancelamentosMensais(req, res);
});

router.get("/listarAtrasosMensais/:nome_fantasia", function (req, res) {
    vooController.listarAtrasosMensais(req, res);
});

router.get("/listarTotalVoosPorCompanhia", function (req, res) {
    vooController.listarTotalVoosPorCompanhia(req, res);
});

router.get("/listarKpisGerencial/:nome_fantasia", function (req, res) {
    vooController.listarKpisGerencial(req, res);
});


module.exports = router;