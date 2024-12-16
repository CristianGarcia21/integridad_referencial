const express = require("express");
const router = express.Router();
const controller = require("../controllers/repuestoController");

router.post("/cargar-json", controller.cargarRepuestoDesdeJSON);


module.exports = router;