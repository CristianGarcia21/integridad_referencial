const express = require("express");
const router = express.Router();
const controller = require("../controllers/provXrepController");


router.post("/cargar-json", controller.cargarDesdeJSON);
router.post("/relacion", controller.crearRelacionProvXRep);


module.exports = router;