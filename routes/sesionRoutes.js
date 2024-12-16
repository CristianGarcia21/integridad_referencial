const express = require("express");
const router = express.Router();
const sesionController = require("../controllers/sesionController");

router.get("/sesiones", sesionController.getSesiones);
router.post("/sesiones", sesionController.createSesion);
router.put("/sesiones/:id", sesionController.updateSesion);
router.delete("/sesiones/:id", sesionController.eliminarSesion);
router.post("/sesiones/importar", sesionController.importarSesiones);


module.exports = router;
