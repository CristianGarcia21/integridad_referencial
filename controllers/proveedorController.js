const Proveedor = require('../models/proveedor');

exports.cargarProveedorDesdeJSON = async (req, res) => {
    try {
        const proveedores = req.body;

        if (!Array.isArray(proveedores)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de proveedores." });
        }

        const errores = [];
        const exitos = [];

        for (const proveedor of proveedores) {
            try {
                const { _id, nombre, apellido, telefono } = proveedor;

                if (!_id || !nombre || !apellido || !telefono) {
                    throw new Error(`Faltan campos obligatorios para el proveedor con ID ${_id || "desconocido"}.`);
                }

                //Verificar si el proveedor ya existe
                const proveedorExistente = await Proveedor.findById(_id);
                if (proveedorExistente) {
                    throw new Error(`El proveedor con ID ${_id} ya existe.`);
                }

                //Crear e insertar el nuevo proveedor
                const nuevoProveedor = new Proveedor({ _id, nombre, apellido, telefono });
                await nuevoProveedor.save();
                exitos.push(`Proveedor con ID ${_id} creado correctamente.`);
            } catch (error) {
                errores.push(error.message);
            }
        }
        res.status(201).json({ message: "Proceso completado.", exitos, errores });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
