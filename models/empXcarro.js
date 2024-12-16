const mongoose = require("mongoose");

const empleadoXcarroSchema = new mongoose.Schema({
    _id: {
        type: Number,
        unique: true,
    },
    ced_emp: {
        type: Number,
        ref: "Empleado",
        required: true,
    },
    idCarroEmer: {
        type: Number,
        required: true,
    },
    fecha_uso: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para generar `_id` automáticamente si no se pasa
empleadoXcarroSchema.pre("save", async function (next) {
    if (!this._id) {
        const lastDoc = await mongoose
            .model("EmpleadoXCarro")
            .findOne()
            .sort({ _id: -1 }); // Obtener el último documento insertado
        this._id = lastDoc ? lastDoc._id + 1 : 1; // Incrementar o iniciar en 1
    }
    next();
});



module.exports = mongoose.model("EmpleadoXCarro", empleadoXcarroSchema, "empleadoxcarros");
