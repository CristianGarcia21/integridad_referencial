const mongoose = require("mongoose");

const empleadoXcarroSchema = new mongoose.Schema({
    idEmpxCarro: {
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

// Middleware para generar `idEmpxCarro` automáticamente si no se pasa
empleadoXcarroSchema.pre("save", async function (next) {
    if (!this.idEmpxCarro) {
        const lastDoc = await mongoose
            .model("EmpleadoXCarro")
            .findOne()
            .sort({ idEmpxCarro: -1 }); // Obtener el último documento insertado
        this.idEmpxCarro = lastDoc ? lastDoc.idEmpxCarro + 1 : 1; // Incrementar o iniciar en 1
    }
    next();
});



module.exports = mongoose.model("EmpleadoXCarro", empleadoXcarroSchema, "empleadoxcarros");
