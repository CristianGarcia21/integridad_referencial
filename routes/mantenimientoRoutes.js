const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientoController');

// Ruta para cargar mantenimientos desde un JSON
router.post('/cargarDesdeJSON', mantenimientoController.cargarDesdeJSON);

// Ruta para crear un nuevo mantenimiento
router.post('/crear', mantenimientoController.crearMantenimiento);

module.exports = router;