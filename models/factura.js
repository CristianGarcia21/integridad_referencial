const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    _id: {
        type: Number,
        unique: true,
    },
    idSesion: {
            type: Number,
            ref: "Sesion",
            required: false,
    },
    idMenu: {
        type: [Number],
        ref: "Menu",
        required: false,
    },
    idUsuario: {
        type: Number,
        ref: "Usuario",
        required: true,
    },
    idMetodoPago: {
        type: Number,
        ref: "MetodoPago",
        required: true,
    },
    valorTotal: {
        type: Number,
        required: true,
    },
    descuento: [{
        idDescuento: {
            type: Number,
            ref: "Descuento",
            required: false,
        },
        tipo: {
            type: String,
            required: false,
        },
        valor: {
            type: Number,
            required: false,
        }
    }]
});

// Middleware para verficar referencias al guardar
facturaSchema.pre("save", async function (next) {
    const Sesion = mongoose.model("Sesion");
    const Menu = mongoose.model("Menu");
    const Usuario = mongoose.model("Usuario");
    const MetodoPago = mongoose.model("MetodoPago");

    // Verificar si las referencias existen
    if (this.idSesion != null) {
        const sesion = await Sesion.findById(this.idSesion);
        if (!sesion) throw new Error(`Sesión con ID ${this.idSesion} no existe.`);
    }

    if (this.idMenu != null) {
        const menu = await Menu.findById(this.idMenu);
        if (!menu) throw new Error(`Menú con ID ${this.idMenu} no existe.`);
    }

    if (this.idUsuario != null) {
        const usuario = await Usuario.findById(this.idUsuario);
        if (!usuario) throw new Error(`Usuario con ID ${this.idUsuario} no existe.`);
    }

    if (this.idMetodoPago != null) {
        const metodoPago = await MetodoPago.findById(this.idMetodoPago);
        if (!metodoPago) throw new Error(`Método de pago con ID ${this.idMetodoPago} no existe.`);
    }

    next();
});

// Middleware para generar actualizaciones en cascada
facturaSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        console.log("Factura actualizada:", doc);
    }
});

module.exports = mongoose.model("Factura", facturaSchema);