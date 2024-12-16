const mongoose = require('mongoose');

const provXrepuestoSchema = new mongoose.Schema({
    id_provxrep: {
        type: Number,
        unique: true,
    },
    id_proveedor: {
        type: Number,
        ref: "Proveedor",
        required: true,
    },
    id_repuesto: {
        type: Number,
        ref: "Repuesto",
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para generar `id_provxrep` automáticamente si no se pasa
empleadoXcarroSchema.pre("save", async function (next) {
    if (!this.id_provxrep) {
        const lastDoc = await mongoose
            .model("provxrepuesto")
            .findOne()
            .sort({ id_provxrep: -1 }); // Obtener el último documento insertado
        this.id_provxrep = lastDoc ? lastDoc.id_provxrep + 1 : 1; // Incrementar o iniciar en 1
    }
    next();
});



module.exports = mongoose.model("provxrepuesto", provXrepuestoSchemaa, "provxrepuestos");
