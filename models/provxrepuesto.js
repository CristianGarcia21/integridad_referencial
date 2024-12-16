const mongoose = require('mongoose');

const provxrepuestoSchema = new mongoose.Schema({
    _id: {
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
    }
});

// Middleware para generar `_id` automáticamente si no se pasa
provxrepuestoSchema.pre("save", async function (next) {
    if (!this._id) {
        const lastDoc = await mongoose
            .model("provxrepuesto")
            .findOne()
            .sort({ _id: -1 }); // Obtener el último documento insertado
        this._id = lastDoc ? lastDoc._id + 1 : 1; // Incrementar o iniciar en 1
    }
    next();
});



module.exports = mongoose.model("provxrepuesto", provxrepuestoSchema, "provxrepuesto");
