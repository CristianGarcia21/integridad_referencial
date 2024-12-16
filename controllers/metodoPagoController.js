const MetodoPago = require('../models/metodoPago');

// Cargar múltiples métodos de pago desde un JSON
exports.cargarMetodosPagoDesdeJSON = async (req, res) => {
    try {
        const metodosPago = req.body;

        // Validar que sea un arreglo
        if (!Array.isArray(metodosPago)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de métodos de pago." });
        }

        const errores = [];
        const exitos = [];

        for (const metodoPago of metodosPago) {
            try {
                const { _id, tipoPago } = metodoPago;

               if (!_id || !tipoPago) {
                   throw new Error(`Faltan campos obligatorios para el método de pago con ID ${_id || "desconocido"}.`);
               }

               // Verificar si el método de pago ya existe
                const metodoPagoExistente = await MetodoPago.findById(_id);
                if (metodoPagoExistente) {
                    throw new Error(`El método de pago con ID ${_id} ya existe.`);
                }

                // Crear e insertar el nuevo método de pago
                const nuevoMetodoPago = new MetodoPago({ _id, tipoPago });
                await nuevoMetodoPago.save();
                exitos.push(`Método de pago con ID ${_id} creado correctamente.`);

            } catch (error) {
                errores.push(error.message);
            }
        }
        res.status(201).json({ message: "Proceso completado.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};