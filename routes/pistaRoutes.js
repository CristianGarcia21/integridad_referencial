const express = require("express");
const {
  crearPista,
  obtenerPistas,
  actualizarPista,
  eliminarPista,
  cargarDesdeJSON,
  eliminarCarroEmergencia,
} = require("../controllers/pistaController");

const router = express.Router();

// Crear una pista
router.post("/", crearPista);

// Obtener todas las pistas
router.get("/", obtenerPistas);

// Actualizar una pista
router.put("/:id", actualizarPista);

// Eliminar una pista
router.delete("/:id", eliminarPista);

// Insertar múltiples pistas desde un JSON
router.post("/cargar-json", cargarDesdeJSON);


router.delete("/carro/:idCarroEmer", eliminarCarroEmergencia);

module.exports = router;
