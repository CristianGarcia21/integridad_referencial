const express = require("express");
const router = express.Router();
const controller = require("../controllers/puestoComidaController");

router.post("/", controller.crearPuestoComida)
router.put("/", controller.actualizarPuestoComida);
router.get("/", controller.obtenerPuestosComida);
router.post("/relacion", controller.importarPuestosComida);

module.exports = router;