const Repuesto = require("../models/repuesto");

exports.cargarRepuestoDesdeJSON = async (req, res) => {
    try {
        const repuestos = req.body;

        if (!Array.isArray(repuestos)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de repuestos." });
        }

        const errores = [];
        const exitos = [];

        for (const repuesto of repuestos) {
            try {
                const { idRepuesto, tipo_repuesto, cantidad, precio } = repuesto;

                if (!idRepuesto || !tipo_repuesto || !cantidad || !precio) {
                    throw new Error(`Faltan campos obligatorios para el repuesto con ID ${idRepuesto || "desconocido"}.`);
                }

                //Verificar si el repuesto ya existe
                const repuestoExistente = await Repuesto.findById(idRepuesto);
                if (repuestoExistente) {
                    throw new Error(`El repuesto con ID ${idRepuesto} ya existe.`);
                }

                //Crear e insertar el nuevo repuesto
                const nuevoRepuesto = new Repuesto({ idRepuesto, tipo_repuesto, cantidad, precio });
                await nuevoRepuesto.save();
                exitos.push(`Repuesto con ID ${idRepuesto} creado correctamente.`);
            } catch (error) {
                errores.push(error.message);
            }
        }
        res.status(201).json({ message: "Proceso completado.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};