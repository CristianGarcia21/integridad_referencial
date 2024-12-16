const mongoose = require("mongoose");

const repuestoSchema = new mongoose.Schema({
    idRepuesto: { type: Number, required: true },
    tipo_repuesto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true }
});

// Middleware para actualizaciones en cascada
repuestoSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const provxrepuesto = mongoose.model("provxrepuesto");
        await provxrepuesto.updateMany(
            { tipo_repuesto: doc.tipo_repuesto },
            { $set: { tipo_repuesto: doc.tipo_repuesto } } // Actualizar el campo referenciado si es necesario
        );
    }
});

module.exports = mongoose.model("Repuesto", repuestoSchema);