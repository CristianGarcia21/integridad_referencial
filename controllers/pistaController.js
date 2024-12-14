const Pista = require("../models/pista");
const EmpleadoXCarro = require("../models/empXcarro");

exports.crearPista = async (req, res) => {
  try {
    const pista = new Pista(req.body);
    await pista.save();
    res.status(201).json({ message: "Pista creada exitosamente." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerPistas = async (req, res) => {
    try {
      const pistas = await Pista.find();
      res.status(200).json(pistas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.actualizarPista = async (req, res) => {
    try {
      const { id } = req.params;
      const pistaActualizada = await Pista.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!pistaActualizada) {
        return res.status(404).json({ message: "Pista no encontrada." });
      }
      res.status(200).json({ message: "Pista actualizada exitosamente.", pista: pistaActualizada });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};
  

exports.eliminarPista = async (req, res) => {
    try {
      const { id } = req.params;
      const pistaEliminada = await Pista.findByIdAndDelete(id);
      if (!pistaEliminada) {
        return res.status(404).json({ message: "Pista no encontrada." });
      }
      res.status(200).json({ message: "Pista eliminada exitosamente." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.cargarDesdeJSON = async (req, res) => {
    try {
      const pistas = req.body;
  
      if (!Array.isArray(pistas)) {
        return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de pistas." });
      }
  
      const errores = [];
      const exitos = [];
  
      for (const pista of pistas) {
        try {
          const nuevaPista = new Pista(pista);
          await nuevaPista.save();
          exitos.push(`Pista ${pista.nombre_pista} insertada correctamente.`);
        } catch (error) {
          errores.push(`Error con la pista ${pista.nombre_pista}: ${error.message}`);
        }
      }
  
      res.status(201).json({ message: "Carga completada.", exitos, errores });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

exports.eliminarCarroEmergencia = async (req, res) => {
  const { idCarroEmer } = req.params;

  try {
    // Verificar si el carro está en uso en EmpleadoXCarro
    const relacionesActivas = await EmpleadoXCarro.find({ idCarroEmer: Number(idCarroEmer) });
    if (relacionesActivas.length > 0) {
      return res.status(400).json({
        error: `El carro de emergencia con ID ${idCarroEmer} está siendo utilizado en relaciones activas y no puede ser eliminado.`,
      });
    }

    // Si no está en uso, eliminarlo de la pista
    const resultado = await Pista.updateOne(
      { "carroEmergencia.idCarroEmer": Number(idCarroEmer) },
      { $unset: { carroEmergencia: "" } }
    );

    if (resultado.modifiedCount === 0) {
      return res.status(404).json({ error: "Carro de emergencia no encontrado." });
    }

    res.status(200).json({ message: `Carro de emergencia ID ${idCarroEmer} eliminado exitosamente.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
