const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientoController');

// Ruta para cargar mantenimientos desde un JSON
router.post('/cargarDesdeJSON', mantenimientoController.cargarDesdeJSON);


module.exports = router;