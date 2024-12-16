const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema de Mantenimiento
const mantenimientoSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    idKart: {
        type: Number,
        required: true
    },
    idPista: {
        type: Schema.Types.ObjectId,
        ref: 'Pista',
        required: true
    },
    idCarroEmer: {
        type: Number,
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
        const Pista = mongoose.model('Pista');
        const Repuesto = mongoose.model('Repuesto');

        const pista = await Pista.findById(this.idPista);
        if (!pista) {
            throw new Error('Pista no encontrada');
        }

        const kartExists = pista.karts.some(kart => kart._id === this.idKart);
        if (!kartExists) {
            throw new Error('Kart no encontrado en la pista');
        }

        const carroEmerExists = pista.carroEmergencia.some(carro => carro._id === this.idCarroEmer);
        if (!carroEmerExists) {
            throw new Error('Carro de emergencia no encontrado en la pista');
        }

        const repuestosExist = await Repuesto.find({ _id: { $in: this.idRepuestos } });
        if (repuestosExist.length !== this.idRepuestos.length) {
            throw new Error('Uno o más repuestos no encontrados');
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Mantenimiento', mantenimientoSchema);