const express = require('express');
const router = express.Router();
const empXMantenimientoController = require('../controllers/empXmantenimientoController');

// Ruta para cargar relaciones desde un JSON
router.post('/cargarDesdeJSON', empXMantenimientoController.cargarDesdeJSON);

// Ruta para crear una nueva relación
router.post('/crearRelacion', empXMantenimientoController.crearRelacion);

module.exports = router;