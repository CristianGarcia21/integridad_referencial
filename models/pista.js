const mongoose = require("mongoose");

const pistaSchema = new mongoose.Schema({
  idPista: { type: Number, required: true, unique: true },
  nombre_pista: { type: String, required: true },
  ubicacion: { type: String, required: true },
  capacidad: { type: Number, required: true },
  longitud: { type: Number, required: true },
  estado: { type: String, required: true },
  tipo: { type: String, required: true },
  valor_hora: { type: Number, required: true },
  carroEmergencia: {
    idCarroEmer: { type: Number, required: true },
    estado: { type: String, required: true },
    matricula: { type: String, required: true },
  },
  karts: [
    {
      idKart: { type: Number, required: true },
      estado: { type: String, required: true },
      modelo: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
});



pistaSchema.pre("remove", async function (next) {
  const EmpleadoXCarro = mongoose.model("EmpleadoXCarro");

  // Eliminar todas las relaciones que hacen referencia a este carro de emergencia
  await EmpleadoXCarro.deleteMany({ idCarroEmer: this.carroEmergencia.idCarroEmer });
  console.log(`Relaciones eliminadas para carroEmergencia ID ${this.carroEmergencia.idCarroEmer}`);
  next();
});

pistaSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    const carroEmergenciaActualizado = doc.carroEmergencia;

    if (carroEmergenciaActualizado) {
      const EmpleadoXCarro = mongoose.model("EmpleadoXCarro");

      // Actualizar las referencias en EmpleadoXCarro
      await EmpleadoXCarro.updateMany(
        { idCarroEmer: carroEmergenciaActualizado.idCarroEmer },
        {
          $set: { idCarroEmer: carroEmergenciaActualizado.idCarroEmer },
        }
      );

      console.log(`Referencias actualizadas para carroEmergencia ID ${carroEmergenciaActualizado.idCarroEmer}`);
    }
  }
});


module.exports = mongoose.model("Pista", pistaSchema, "pista");

