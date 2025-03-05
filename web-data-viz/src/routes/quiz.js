var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");

//Recebendo os dados do html e direcionando para a função cadastrar de quizController.js
router.post("/resultadoQuiz", function (req, res) {
    quizController.resultadoQuiz(req, res);
});

router.get("/pontos/:fkUsuario", function (req, res) {
    quizController.pontos(req, res);
});

module.exports = router;