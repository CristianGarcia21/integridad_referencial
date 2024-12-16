const mongoose = require("mongoose");

const repuestoSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    tipoRepuesto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true }
});

// Middleware para actualizaciones en cascada
repuestoSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const provxrepuesto = mongoose.model("provxrepuesto");
        await provxrepuesto.updateMany(
            { tipoRepuesto: doc.tipoRepuesto },
            { $set: { tipoRepuesto: doc.tipoRepuesto } } // Actualizar el campo referenciado si es necesario
        );
    }
});

module.exports = mongoose.model("Repuesto", repuestoSchema);