const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

router.post('/proveedores/cargar-json', proveedorController.cargarProveedorDesdeJSON);

module.exports = router;