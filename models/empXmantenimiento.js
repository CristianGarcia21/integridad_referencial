const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Esquema
const empXmantenimientoSchema = new Schema({
    idEmpleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    idMantenimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Mantenimiento',
        required: true
    }
});
// Middleware para verificar que las relaciones existan antes de guardar
empXmantenimientoSchema.pre('validate', async function (next) {
    try {
        const empleado = await mongoose.model('Empleado').findById(this.idEmpleado);
        const mantenimiento = await mongoose.model('Mantenimiento').findById(this.idMantenimiento);

        if (!empleado) {
            const error = new Error('Empleado no existe');
            next(error);
        } else if (!mantenimiento) {
            const error = new Error('Mantenimiento no existe');
            next(error);
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

// Middleware verificar relaciones antes de eliminar
empXmantenimientoSchema.pre('remove', async function (next) {
    try {
        const empleado = await mongoose.model('Empleado').findById(this.idEmpleado);
        const mantenimiento = await mongoose.model('Mantenimiento').findById(this.idMantenimiento);

        if (empleado || mantenimiento) {
            const error = new Error('No se puede eliminar empleado o mantenimiento con relaciones');
            next(error);
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

// Middleware para actualizar en cascada
empXmantenimientoSchema.pre('save', async function (next) {
    try {
        const empleado = await mongoose.model('Empleado').findById(this.idEmpleado);
        const mantenimiento = await mongoose.model('Mantenimiento').findById(this.idMantenimiento);

        if (!empleado || !mantenimiento) {
            const error = new Error('Empleado o mantenimiento no existe');
            next(error);
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('EmpXmantenimiento', empXmantenimientoSchema);