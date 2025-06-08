var express = require("express");
var router = express.Router();

var feedbackController = require("../controllers/feedbackController");

//Recebendo os dados do html e direcionando para a função cadastrar de feedbackController.js
router.post("/cadastrar", function (req, res) {
    feedbackController.cadastrar(req, res);
})

router.get("/listarFeedback", function (req, res) {
    feedbackController.listarFeedback(req, res);
});

router.get("/listarFeedbackPorCriador/:fkCriador", function (req, res) {
    feedbackController.listarFeedbackPorCriador(req, res);
});

router.delete("/excluirFeedback", function (req, res) {
    feedbackController.excluirFeedback(req, res);
});

router.put("/atualizarFeedback", function (req, res) {
    feedbackController.atualizarFeedback(req, res);
});


module.exports = router;