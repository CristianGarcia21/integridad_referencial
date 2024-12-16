const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Esquema de Mantenimiento
const mantenimientoSchema = new Schema({
    idMantenimiento: {
        type: Number,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    idKart: {
        type: Schema.Types.ObjectId,
        ref: 'Kart',
        required: true
    },
    idPista: {
        type: Schema.Types.ObjectId,
        ref: 'Pista',
        required: true
    },
    idCarroEmer: {
        type: Schema.Types.ObjectId,
        ref: 'CarroEmer',
        required: true
    },
    idRepuestos: [{
        type: Schema.Types.ObjectId,
        ref: 'Repuesto',
        required: true
    }]
});

// Middleware para asegurar las relaciones
mantenimientoSchema.pre('save', async function (next) {
    try {
        const Kart = mongoose.model('Kart');
        const Pista = mongoose.model('Pista');
        const CarroEmer = mongoose.model('CarroEmer');
        const Repuesto = mongoose.model('Repuesto');

        const pistaExists = await Pista.findById(this.idPista);
        const pista = await Pista.findById(this.idPista).populate('karts');
        const kartExists = pista && pista.karts.id(this.idKart);
        const carroEmerExists = await CarroEmer.findById(this.idCarroEmer);
        const repuestosExist = await Repuesto.find({ _id: { $in: this.idRepuestos } });

        if (!kartExists) {
            throw new Error('Kart no encontrado');
        }
        if (!pistaExists) {
            throw new Error('Pista no encontrada');
        }
        if (!carroEmerExists) {
            throw new Error('Carro de emergencia no encontrado');
        }
        if (repuestosExist.length !== this.idRepuestos.length) {
            throw new Error('Uno o más repuestos no encontrados');
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Middleware para actualizar en cascada
mantenimientoSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        if (update.idKart) {
            const Kart = mongoose.model('Kart');
            const pista = await mongoose.model('Pista').findById(update.idPista).populate('karts');
            const kartExists = pista && pista.karts.id(update.idKart);
            if (!kartExists) {
                throw new Error('Kart no encontrado');
            }
        }
        if (update.idPista) {
            const Pista = mongoose.model('Pista');
            const pistaExists = await Pista.findById(update.idPista);
            if (!pistaExists) {
                throw new Error('Pista no encontrada');
            }
        }
        if (update.idCarroEmer) {
            const CarroEmer = mongoose.model('CarroEmer');
            const carroEmerExists = await CarroEmer.findById(update.idCarroEmer);
            if (!carroEmerExists) {
                throw new Error('Carro de emergencia no encontrado');
            }
        }
        if (update.idRepuestos) {
            const Repuesto = mongoose.model('Repuesto');
            const repuestosExist = await Repuesto.find({ _id: { $in: update.idRepuestos } });
            if (repuestosExist.length !== update.idRepuestos.length) {
                throw new Error('Uno o más repuestos no encontrados');
            }
        }
        next();
    } catch (error) {
        s
        next(error);
    }
});

// Middleware para evitar eliminación si hay relaciones
mantenimientoSchema.pre('remove', async function (next) {
    try {
        const Mantenimiento = mongoose.model('Mantenimiento');
        const mantenimientos = await Mantenimiento.find({
            $or: [
                { idKart: this._id },
                { idPista: this._id },
                { idCarroEmer: this._id },
                { idRepuestos: this._id }
            ]
        });

        if (mantenimientos.length > 0) {
            throw new Error('No se puede eliminar, hay relaciones existentes');
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Mantenimiento', mantenimientoSchema);