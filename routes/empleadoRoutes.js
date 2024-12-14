const express = require("express");
const router = express.Router();
const empleadoController = require("../controllers/empleadoController");

router.post("/empleados/cargar-json", empleadoController.cargarEmpleadosDesdeJSON);

module.exports = router;
