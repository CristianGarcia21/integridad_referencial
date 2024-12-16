const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema({
    _id: { type: Number, required: true }, // ID manual para garantizar unicidad
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    rol: { type: String, required: true },
});

// Middleware para evitar eliminar empleados con relaciones activas
empleadoSchema.pre("remove", async function (next) {
    const EmpleadoXCarro = mongoose.model("EmpleadoXCarro");
    const existeRelacion = await EmpleadoXCarro.findOne({ ced_emp: this._id });
    if (existeRelacion) {
        throw new Error(`No se puede eliminar el empleado con ID ${this._id}, ya que tiene relaciones activas.`);
    }
    next();
});

// Middleware para eliminar relaciones en cascada
empleadoSchema.pre("remove", async function (next) {
    const EmpleadoXCarro = mongoose.model("EmpleadoXCarro");
    await EmpleadoXCarro.deleteMany({ ced_emp: this._id }); // Eliminar todas las relaciones
    next();
});

// Middleware para actualizaciones en cascada
empleadoSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const EmpleadoXCarro = mongoose.model("EmpleadoXCarro");
        await EmpleadoXCarro.updateMany(
            { ced_emp: doc._id },
            { $set: { ced_emp: doc._id } } // Actualizar el campo referenciado si es necesario
        );
    }
});

module.exports = mongoose.model("Empleado", empleadoSchema);
