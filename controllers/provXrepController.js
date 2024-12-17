const {ObjectId} = require("mongodb");
const Proveedor = require("../models/proveedor");
const Repuesto = require("../models/repuesto");
const ProvXRepuesto = require("../models/provxrepuesto");

function convertirFecha(fechaStr) {
    const [dia, mes, anio] = fechaStr.split('/');
    const anioCompleto = `20${anio}`; // Asegurarse de que el año tenga 4 dígitos
    return new Date(`${anioCompleto}-${mes}-${dia}`);
}

exports.cargarDesdeJSON = async (req, res) => {
    try {
        const relaciones = req.body;

        if (!Array.isArray(relaciones)) {
            return res.status(400).json({error: "El cuerpo de la solicitud debe ser un arreglo de relaciones."});
        }

        const errores = [];
        const exitos = [];

        for (const relacion of relaciones) {
            try {
                const {id_proveedor, id_repuesto} = relacion;

                // Validar existencia de proveedor (ID numérico)
                const proveedor = await Proveedor.findOne({_id: id_proveedor});
                if (!proveedor) {
                    throw new Error(`El proveedor con ID ${id_proveedor} no existe.`);
                }

                // Validar existencia del repuesto en la base de datos
                const repuesto = await Repuesto.findOne({idRepuesto: id_repuesto});

                if (!repuesto) {
                    throw new Error(`El repuesto con ID ${id_repuesto} no existe.`);
                }

                const fechaConvertida = convertirFecha(relacion.fecha);

                // Insertar la relación
                const nuevaRelacion = new ProvXRepuesto({
                    id_proveedor,
                    id_repuesto,
                    fecha: fechaConvertida,
                });
                await nuevaRelacion.save();

                exitos.push(`Relación insertada: Proveedor ${id_proveedor} - Repuesto ${id_repuesto}`);
            } catch (error) {
                errores.push(`Error con relación Proveedor ${relacion.id_proveedor} - Repuesto ${relacion.id_repuesto}: ${error.message}`);
            }
        }

        res.status(201).json({message: "Carga completada.", exitos, errores});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.crearRelacionProvXRep = async (req, res) => {
    try {
        const {id_proveedor, id_repuesto, fecha} = req.body;

        // Validar que el proveedor exista
        const proveedor = await Proveedor.findOne({_id: id_proveedor});
        if (!proveedor) {
            return res.status(404).json({error: `El proveedor con ID ${id_proveedor} no existe.`});
        }

        // Validar que el repuesto exista
        const repuesto = await Repuesto.findOne({idRepuesto: id_repuesto});
        if (!repuesto) {
            return res.status(404).json({error: `El repuesto con ID ${id_repuesto} no existe.`});
        }

        // Crear la relación
        const nuevaRelacion = new ProvXRepuesto({
            id_proveedor,
            id_repuesto,
            fecha,
        });
        await nuevaRelacion.save();

        res.status(201).json({message: "Relación creada.", relacion: nuevaRelacion});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}