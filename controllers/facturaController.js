const Factura = require('../models/factura');

exports.cargarDesdeJSON = async (req, res) => {
    try {
        const facturas = req.body;

        if (!Array.isArray(facturas)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de facturas." });
        }

        const errores = [];
        const exitos = [];

        for (const factura of facturas) {
            // Validar que idMenu sea un array de números
            if (factura.idMenu && !Array.isArray(factura.idMenu)) {
                errores.push(`Error con factura ${factura._id}: idMenu debe ser un array.`);
            } else if (factura.idMenu) {
                for (const id of factura.idMenu) {
                    if (typeof id !== 'number') {
                        errores.push(`Error con factura ${factura._id}: cada id en idMenu debe ser un número.`);
                    }
                }
            }

            try {
                const nuevaFactura = new Factura(factura);
                await nuevaFactura.save();
                exitos.push(`Factura insertada: ${nuevaFactura._id}`);
            } catch (error) {
                errores.push(`Error con factura ${factura._id}: ${error.message}`);
            }
        }

        res.status(201).json({ message: "Carga completada.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
