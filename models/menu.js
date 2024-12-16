const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  idMenu: { type: Number, required: true, unique: true },
  nombre_plato: { type: String, required: true },
  ingredientes: { type: String, required: true },
  valor_unitario: { type: Number, required: true }
});

//Actualizar menu en cascada
menuSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.idMenu) {
    await mongoose.model('Menu').updateMany(
      { idMenu: update.idMenu },
      { $set: update }
    );
  }
  next();
});

module.exports = mongoose.model("Menu", menuSchema, "menu");
