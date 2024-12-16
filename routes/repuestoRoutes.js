const express = require("express");
const router = express.Router();
const repuestoController = require("../controllers/repuestoController");

router.post("/repuestos/cargar-json", repuestoController.cargarRepuestoDesdeJSON);

module.exports = router;