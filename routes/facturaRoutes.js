const express = require("express");
const router = express.Router();
const controller = require("../controllers/facturaController");

console.log("Este es el error", controller.cargarDesdeJSON);
router.post("/cargar-json", controller.cargarDesdeJSON);


module.exports = router;