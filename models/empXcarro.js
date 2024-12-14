const mongoose = require("mongoose");

const empleadoXcarroSchema = new mongoose.Schema({
    id_empXcarro: {
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

// Middleware para generar `id_empXcarro` automáticamente si no se pasa
empleadoXcarroSchema.pre("save", async function (next) {
    if (!this.id_empXcarro) {
        const lastDoc = await mongoose
            .model("EmpleadoXCarro")
            .findOne()
            .sort({ id_empXcarro: -1 }); // Obtener el último documento insertado
        this.id_empXcarro = lastDoc ? lastDoc.id_empXcarro + 1 : 1; // Incrementar o iniciar en 1
    }
    next();
});



module.exports = mongoose.model("EmpleadoXCarro", empleadoXcarroSchema, "empleadoxcarros");
