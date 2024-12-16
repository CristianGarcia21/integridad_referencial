const express = require('express');
const router = express.Router();
const controller = require('../controllers/implementosController');

// Ruta para cargar relaciones desde un JSON
router.post('/cargarDesdeJSON', controller.importarImplementos);

// Ruta para crear una nueva relación
//router.post('/crear', empXMantenimientoController.crearRelacion);

module.exports = router;