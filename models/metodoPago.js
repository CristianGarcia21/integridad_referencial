const mongoose = require("mongoose");

const metodoPagoSchema = new mongoose.Schema({
    id_metodo_pago: { type: Number, required: true },
    tipo_pago: { type: String, required: true }
});

// Middleware para actualizaciones en cascada
metodoPagoSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const pago = mongoose.model("pago");
        await pago.updateMany(
            { tipo_pago: doc.tipo_pago },
            { $set: { tipo_pago: doc.tipo_pago } } // Actualizar el campo referenciado si es necesario
        );
    }
});

module.exports = mongoose.model("MetodoPago", metodoPagoSchema);
