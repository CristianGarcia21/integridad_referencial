const express = require('express');
const router = express.Router();
const controller = require('../controllers/proveedorController');

router.post('/cargar-json', controller.cargarProveedorDesdeJSON);

module.exports = router;