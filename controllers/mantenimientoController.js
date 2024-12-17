const Mantenimiento = require("../models/mantenimiento");

exports.cargarDesdeJSON = async (req, res) => {
    try {
        const mantenimientos = req.body;

        if (!Array.isArray(mantenimientos)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de mantenimientos." });
        }

        const errores = [];
        const exitos = [];

        for (const mantenimiento of mantenimientos) {
            try {
                const { _id, descripcion, idKart, idPista, idCarroEmer, idRepuestos } = mantenimiento;

                // Crear e insertar el nuevo mantenimiento
                const nuevoMantenimiento = new Mantenimiento({ _id, descripcion, idKart, idPista, idCarroEmer, idRepuestos });
                await nuevoMantenimiento.save();
                exitos.push(`Mantenimiento con ID ${_id} creado correctamente.`);
            } catch (error) {
                errores.push(`Error con mantenimiento ID ${mantenimiento._id}: ${error.message}`);
            }
        }

        res.status(201).json({ message: "Carga completada.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};