var express = require("express");
var router = express.Router();

var anotacaoController = require("../controllers/anotacaoController");

//Recebendo os dados do html e direcionando para a função cadastrar de anotacaoController.js
router.post("/cadastrar", function (req, res) {
    anotacaoController.cadastrar(req, res);
})

router.post("/listarObservacao", function (req, res) {
    anotacaoController.listarObservacao(req, res);
});

router.delete("/excluirObservacao", function (req, res) {
    anotacaoController.excluirObservacao(req, res);
});

router.put("/atualizarObservacao", function (req, res) {
    anotacaoController.atualizarObservacao(req, res);
});


module.exports = router;