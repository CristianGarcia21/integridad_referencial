const express = require("express");
const router = express.Router();
const controller = require("../controllers/repuestoController");

router.post("/repuestos/cargar-json", controller.cargarRepuestoDesdeJSON);

router.post("/repuestos", controller.crearRepuesto);
router.put("/repuestos", controller.actualizarRepuesto);
router.get("/repuestos", controller.obtenerRepuestos);

module.exports = router;