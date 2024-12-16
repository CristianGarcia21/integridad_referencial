const Empleado = require("../models/empleado");
const Mantenimiento = require("../models/mantenimiento");
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
                const { ced_emp, idMantenimiento } = relacion;

                // Validar existencia de empleado
                const empleado = await Empleado.findById(ced_emp);
                if (!empleado) {
                    throw new Error(`El empleado con ID ${ced_emp} no existe.`);
                }

                // Validar existencia de mantenimiento
                const mantenimiento = await Mantenimiento.findById(idMantenimiento);
                if (!mantenimiento) {
                    throw new Error(`El mantenimiento con ID ${idMantenimiento} no existe.`);
                }

                // Crear e insertar la nueva relación
                const nuevaRelacion = new EmpXMantenimiento({ ced_emp, idMantenimiento });
                await nuevaRelacion.save();
                exitos.push(`Relación con empleado ID ${ced_emp} y mantenimiento ID ${idMantenimiento} creada correctamente.`);
            } catch (error) {
                errores.push(error.message);
            }
        }

        res.status(201).json({ message: "Carga completada.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearRelacion = async (req, res) => {
    try {
        const { ced_emp, idMantenimiento } = req.body;

        // Validar existencia de empleado
        const empleado = await Empleado.findById(ced_emp);
        if (!empleado) {
            return res.status(404).json({ error: `El empleado con ID ${ced_emp} no existe.` });
        }

        // Validar existencia de mantenimiento
        const mantenimiento = await Mantenimiento.findById(idMantenimiento);
        if (!mantenimiento) {
            return res.status(404).json({ error: `El mantenimiento con ID ${idMantenimiento} no existe.` });
        }

        // Crear la relación
        const nuevaRelacion = new EmpXMantenimiento({ ced_emp, idMantenimiento });
        await nuevaRelacion.save();

        res.status(201).json({ message: "Relación creada exitosamente.", relacion: nuevaRelacion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};