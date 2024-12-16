const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    nombre_plato: { type: String, required: true }, 
    ingredientes: { type: String, required: true }, 
    valor_unitario: { type: Number, required: true } 
  });

module.exports = mongoose.model("Menu", menuSchema, "menu");
