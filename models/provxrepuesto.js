const mongoose = require('mongoose');

const provXrepuestoSchema = new mongoose.Schema({
    idProvxRep: {
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

// Middleware para generar `idProvxRep` automáticamente si no se pasa
empleadoXcarroSchema.pre("save", async function (next) {
    if (!this.idProvxRep) {
        const lastDoc = await mongoose
            .model("provxrepuesto")
            .findOne()
            .sort({ idProvxRep: -1 }); // Obtener el último documento insertado
        this.idProvxRep = lastDoc ? lastDoc.idProvxRep + 1 : 1; // Incrementar o iniciar en 1
    }
    next();
});



module.exports = mongoose.model("provxrepuesto", provXrepuestoSchemaa, "provxrepuestos");
