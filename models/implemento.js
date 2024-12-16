const mongoose = require("mongoose");

const implementoSchema = new mongoose.Schema({
  _id: { type: Number, required: true }, // ID único para cada implemento
  nombre_implemento: { type: String, required: true }, // Nombre del implemento
  tipo_implemento: { type: String, required: true }, // Tipo de implemento (por ejemplo, Seguridad)
  cantidad: { type: Number, required: true, min: 0 }, // Cantidad disponible del implemento
});

// Exportar el modelo
module.exports = mongoose.model("Implemento", implementoSchema, "implementos");
