const express = require("express");
const router = express.Router();
const controller = require("../controllers/empXCarroController");


router.post("/cargar-json", controller.cargarDesdeJSON);
router.post("/relacion", controller.crearRelacionEmpleadoXCarro);


module.exports = router;
