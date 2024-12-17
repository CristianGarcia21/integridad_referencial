const EmpXMantenimiento = require("../models/empXmantenimiento");

exports.cargarDesdeJSON = async (req, res) => {
    try {
        const relaciones = req.body;

        if (!Array.isArray(relaciones)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de relaciones." });
        }

        const errores = [];
        const exitos = [];

        for (const relacion of relaciones) {
            try {
                const { idEmpleado, idMantenimiento } = relacion;

                // Crear e insertar la nueva relación
                const nuevaRelacion = new EmpXMantenimiento({ idEmpleado, idMantenimiento });
                await nuevaRelacion.save();
                exitos.push(`Relación con empleado ID ${idEmpleado} y mantenimiento ID ${idMantenimiento} creada correctamente.`);
            } catch (error) {
                errores.push(`Error con relación Empleado ${relacion.idEmpleado} - Mantenimiento ${relacion.idMantenimiento}: ${error.message}`);
            }
        }

        res.status(201).json({ message: "Carga completada.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearRelacion = async (req, res) => {
    try {
        const { idEmpleado, idMantenimiento } = req.body;

        // Crear e insertar la nueva relación
        const nuevaRelacion = new EmpXMantenimiento({ idEmpleado, idMantenimiento });
        await nuevaRelacion.save();

        res.status(201).json({ message: "Relación creada correctamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};