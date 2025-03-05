var express = require("express");
var router = express.Router();

var kpi1Controller = require("../controllers/kpi1Controller");

router.get("/listar/:fkUsuario", function (req, res) {
    kpi1Controller.listar(req, res);
});

module.exports = router;