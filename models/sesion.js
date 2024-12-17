const mongoose = require("mongoose");

const sesionSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true }, 
  idPista: {type: Number, required: true, ref: "Pista",},
  id_usuario: [{ type: Number, required: true, ref: "Usuario",  },],
  hora_inicio: { type: String, required: true },
  hora_fin: { type: String, required: true },
  fecha: { type: String, required: true },
  ced_empleado: { type: Number,required: true,ref: "Empleado", },
  id_kart: { type: Number, required: true, 
  },
  usuarioXimplemento: [
    { id_implemento: { type: Number, required: true, ref: "Implemento", },
      id_usuario: { type: Number, required: true, ref: "Usuario", },
      ced_empleado: {type: Number,required: true, ref: "Empleado", },
      estado: { type: String, required: true },
    },
  ],
});

// Middleware para verificar referencias al guardar
sesionSchema.pre("save", async function (next) {
  const Usuario = mongoose.model("Usuario");
  const Empleado = mongoose.model("Empleado");
  const Implemento = mongoose.model("Implemento");
  const Pista = mongoose.model("Pista");

  // Verificar si las referencias existen
  for (const idUsuario of this.id_usuario) {
    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) throw new Error(`Usuario con ID ${idUsuario} no existe.`);
  }

  const empleado = await Empleado.findById(this.ced_empleado);
  if (!empleado)
    throw new Error(`Empleado con ID ${this.ced_empleado} no existe.`);

  const pista = await Pista.findById(this.idPista);
  if (!pista) throw new Error(`Pista con ID ${this.idPista} no existe.`);

  for (const implemento of this.usuarioXimplemento) {
    const implementoExistente = await Implemento.findById(
      implemento.id_implemento
    );
    if (!implementoExistente)
      throw new Error(
        `Implemento con ID ${implemento.id_implemento} no existe.`
      );
  }

  next();
});

// Middleware para actualizaciones en cascada
sesionSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    console.log("Sesión actualizada:", doc);
  }
});

module.exports = mongoose.model("Sesion", sesionSchema, "sesiones");
