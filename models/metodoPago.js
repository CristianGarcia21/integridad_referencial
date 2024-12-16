const mongoose = require("mongoose");

const metodoPagoSchema = new mongoose.Schema({
    idMetodoPago: { type: Number, required: true },
    tipoPago: { type: String, required: true }
});

// Middleware para actualizaciones en cascada
metodoPagoSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const pago = mongoose.model("pago");
        await pago.updateMany(
            { tipoPago: doc.tipoPago },
            { $set: { tipoPago: doc.tipoPago } } // Actualizar el campo referenciado si es necesario
        );
    }
});

module.exports = mongoose.model("MetodoPago", metodoPagoSchema);
