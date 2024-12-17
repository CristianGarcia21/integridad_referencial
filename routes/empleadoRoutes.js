const express = require("express");
const router = express.Router();
const empleadoController = require("../controllers/empleadoController");

router.post("/empleados/cargar-json", empleadoController.cargarEmpleadosDesdeJSON);
router.delete("/empleados/:id", empleadoController.eliminarEmpleado);
router.put("/empleados/:id", empleadoController.actualizarEmpleado);

module.exports = router;
