const express = require("express");
const router = express.Router();
const empleadoController = require("../controllers/usuarioController");

router.post("/usuarios/cargar-json", empleadoController.importarUsuarios);
router.put("/usuarios/:id", empleadoController.actualizarUsuario);
router.delete("/usuarios/:id", empleadoController.eliminarUsuario);

module.exports = router;