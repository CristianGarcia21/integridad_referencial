const express = require("express");
const router = express.Router();
const metodoPagoController = require("../controllers/metodoPagoController");

router.post("/metodos-pago/cargar-json", metodoPagoController.cargarMetodosPagoDesdeJSON);

module.exports = router;