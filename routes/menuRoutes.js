const express = require("express");
const router = express.Router();
const controller = require("../controllers/menuController");

router.post("/cargar-json", controller.importarMenus);
router.put("/menus/:id", controller.actualizarMenu);
router.delete("/menus/:id", controller.eliminarMenu);

module.exports = router;