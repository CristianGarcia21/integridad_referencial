const { ObjectId } = require("mongodb"); 
const Empleado = require("../models/empleado"); 
const Pista = require("../models/pista"); 
const EmpleadoXCarro = require("../models/empXcarro"); 


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
        const { ced_emp, idCarroEmer } = relacion;

        // Validar existencia de empleado (ID numérico)
        const empleado = await Empleado.findOne({ _id: ced_emp });
        if (!empleado) {
          throw new Error(`El empleado con ID ${ced_emp} no existe.`);
        }

        // Validar existencia del carro de emergencia en las pistas
        const pista = await Pista.findOne({
          "carroEmergencia.idCarroEmer": idCarroEmer,
        });

        if (!pista) {
          throw new Error(`El carro de emergencia con ID ${idCarroEmer} no existe en ninguna pista.`);
        }

        // Insertar la relación
        const nuevaRelacion = new EmpleadoXCarro({
          ced_emp,
          idCarroEmer,
          fecha_uso: relacion.fecha_uso,
        });
        await nuevaRelacion.save();

        exitos.push(`Relación insertada: Empleado ${ced_emp} - Carro ${idCarroEmer}`);
      } catch (error) {
        errores.push(`Error con relación Empleado ${relacion.ced_emp} - Carro ${relacion.idCarroEmer}: ${error.message}`);
      }
    }

    res.status(201).json({ message: "Carga completada.", exitos, errores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearRelacionEmpleadoXCarro = async (req, res) => {
  try {
    const { ced_emp, idCarroEmer, fecha_uso } = req.body;

    // Validar que el empleado exista
    const empleado = await Empleado.findOne({ _id: ced_emp });
    if (!empleado) {
      return res.status(404).json({
        error: `El empleado con ID ${ced_emp} no existe.`,
      });
    }

    // Validar que el carro de emergencia exista
    const pista = await Pista.findOne({ "carroEmergencia.idCarroEmer": idCarroEmer });
    if (!pista) {
      return res.status(404).json({
        error: `El carro de emergencia con ID ${idCarroEmer} no existe en ninguna pista.`,
      });
    }

    // Crear la relación
    const nuevaRelacion = new EmpleadoXCarro({
      ced_emp,
      idCarroEmer,
      fecha_uso,
    });

    await nuevaRelacion.save();

    res.status(201).json({
      message: "Relación creada exitosamente.",
      relacion: nuevaRelacion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.obtenerEmpXCarro = async (req, res) => {
    try {
      const empXCarro = await EmpleadoXCarro.find()
        .populate("ced_emp", "_id nombre apellido telefono rol") // Cargar datos del empleado
        .populate({
          path: "idCarroEmer", // Cargar datos del carro de emergencia
          select: "carroEmergencia.idCarroEmer carroEmergencia.estado carroEmergencia.matricula", // Seleccionar campos específicos
          model: "Pista", // Debes especificar explícitamente que `idCarroEmer` pertenece a la colección `Pista`
        });
  
      res.status(200).json(empXCarro);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
