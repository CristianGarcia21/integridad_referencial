const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true, min: 18 },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
});
// Middleware para copiar el campo `id` a `_id`
usuarioSchema.pre("save", function (next) {
  if (!this._id) {
    this._id = this.id; // Copia `id` a `_id` antes de guardar
  }
  next();
});

// Middleware para garantizar integridad en eliminaciones
usuarioSchema.pre("findOneAndDelete", async function (next) {
  const PuestoComida = mongoose.model("PuestoComida");
  const referencia = await PuestoComida.findOne({ "resenas._id": this._id });

  if (referencia) {
    throw new Error(`No se puede eliminar el usuario ${this._id} porque está referenciado en reseñas.`);
  }

  next();
});

module.exports = mongoose.model("Usuario", usuarioSchema, "usuarios");
