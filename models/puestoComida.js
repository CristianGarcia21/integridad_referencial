const mongoose = require("mongoose");

const puestoComidaSchema = new mongoose.Schema({
  idPuestoComida: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  capacidad: { type: Number, required: true },
  localizacion: { type: String, required: true },
  idMenu: [{ type: Number, ref: "Menu" }],
  resenas: [
    {
      idResena: { type: Number, required: true },
      idUsuario: { type: Number, ref: "Usuario" },
      fecha: { type: Date, required: true },
      descripcion: { type: String, required: true },
    },
  ],
});

// Middleware para integridad referencial
puestoComidaSchema.pre("save", async function (next) {
  const Menu = mongoose.model("Menu");
  const Usuario = mongoose.model("Usuario");

  // Validar que todos los idMenu existan
  for (let id of this.idMenu) {
    const menuExists = await Menu.findOne({ idMenu: id });
    if (!menuExists) {
      throw new Error(`El menú con ID ${id} no existe.`);
    }
  }

  // Validar y convertir fechas en las reseñas
  for (let resena of this.resenas) {
    const usuarioExists = await Usuario.findOne({ id: resena.idUsuario });
    if (!usuarioExists) {
      throw new Error(`El usuario con ID ${resena.idUsuario} no existe.`);
    }

    // Convertir fecha a tipo Date si es un string
    if (typeof resena.fecha === "string") {
      const [day, month, year] = resena.fecha.split("/");
      resena.fecha = new Date(`${year}-${month}-${day}`);
      if (isNaN(resena.fecha)) {
        throw new Error(`El formato de fecha "${resena.fecha}" en la reseña no es válido.`);
      }
    }
  }

  next();
});


// Middleware para actualizar referencias en cascada
puestoComidaSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    console.log(`Puesto de comida actualizado: ${doc.idPuestoComida}`);
  }
});

// Middleware para eliminar en cascada
puestoComidaSchema.pre("remove", async function (next) {
  const Menu = mongoose.model("Menu");

  // Puedes agregar lógica para eliminar o manejar las dependencias aquí
  console.log(`Puesto de comida eliminado: ${this.idPuestoComida}`);
  next();
});


module.exports = mongoose.model("PuestoComida", puestoComidaSchema, "puesto_comida");