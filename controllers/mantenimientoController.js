const Mantenimiento = require("../models/mantenimiento");
const Pista = require("../models/pista");
const Repuesto = require("../models/repuesto");

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
                const { idMantenimiento, descripcion, idKart, idPista, idCarroEmer, idRepuestos } = mantenimiento;

                // Validar existencia de pista y carro de emergencia embebido
                const pista = await Pista.findById(idPista);
                if (!pista) {
                    throw new Error(`La pista con ID ${idPista} no existe.`);
                }

                const carroEmerExists = pista.carroEmergencia.some(carro => carro.idCarroEmer === idCarroEmer);
                if (!carroEmerExists) {
                    throw new Error(`El carro de emergencia con ID ${idCarroEmer} no existe en la pista con ID ${idPista}.`);
                }

                // Validar existencia de repuestos
                const repuestosExist = await Repuesto.find({ _id: { $in: idRepuestos } });
                if (repuestosExist.length !== idRepuestos.length) {
                    throw new Error('Uno o más repuestos no encontrados');
                }

                // Crear e insertar el nuevo mantenimiento
                const nuevoMantenimiento = new Mantenimiento({ idMantenimiento, descripcion, idKart, idPista, idCarroEmer, idRepuestos });
                await nuevoMantenimiento.save();
                exitos.push(`Mantenimiento con ID ${idMantenimiento} creado correctamente.`);
            } catch (error) {
                errores.push(error.message);
            }
        }

        res.status(201).json({ message: "Carga completada.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.crearMantenimiento = async (req, res) => {
    try {
        const { idMantenimiento, descripcion, idKart, idPista, idCarroEmer, idRepuestos } = req.body;

        // Validar existencia de pista y carro de emergencia embebido
        const pista = await Pista.findById(idPista);
        if (!pista) {
            return res.status(404).json({ error: `La pista con ID ${idPista} no existe.` });
        }

        const carroEmerExists = pista.carroEmergencia.some(carro => carro.idCarroEmer === idCarroEmer);
        if (!carroEmerExists) {
            return res.status(404).json({ error: `El carro de emergencia con ID ${idCarroEmer} no existe en la pista con ID ${idPista}.` });
        }

        // Validar existencia de repuestos
        const repuestosExist = await Repuesto.find({ _id: { $in: idRepuestos } });
        if (repuestosExist.length !== idRepuestos.length) {
            return res.status(404).json({ error: 'Uno o más repuestos no encontrados' });
        }

        // Crear el mantenimiento
        const nuevoMantenimiento = new Mantenimiento({ idMantenimiento, descripcion, idKart, idPista, idCarroEmer, idRepuestos });
        await nuevoMantenimiento.save();

        res.status(201).json({ message: "Mantenimiento creado exitosamente.", mantenimiento: nuevoMantenimiento });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};