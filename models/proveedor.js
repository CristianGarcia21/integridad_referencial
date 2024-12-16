const mongose = require('mongoose');

const proveedorSchema = new mongose.Schema({
    _id: { type: Number, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
});

// Middleware para actualizaciones en cascada
empleadoSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const provxrepuesto = mongoose.model("provxrepuesto");
        await provxrepuesto.updateMany(
            { ced_emp: doc._id },
            { $set: { ced_emp: doc._id } } // Actualizar el campo referenciado si es necesario
        );
    }
});

module.exports = mongose.model("Proveedor", proveedorSchema);