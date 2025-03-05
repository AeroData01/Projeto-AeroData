var express = require("express");
var router = express.Router();

var kpi2Controller = require("../controllers/kpi2Controller");

router.get("/listarMIN/:fkUsuario", function (req, res) {
    kpi2Controller.listarMIN(req, res);
});

module.exports = router;