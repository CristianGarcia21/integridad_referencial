const Sesion = require("../models/sesion");

// Obtener todas las sesiones
exports.getSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion.find()
      .populate("idPista")
      .populate("id_usuario")
      .populate("usuarioXimplemento.id_implemento")
      .populate("usuarioXimplemento.id_usuario")
      .populate("usuarioXimplemento.ced_empleado")
      .populate("ced_empleado");
    res.status(200).json(sesiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva sesión
exports.createSesion = async (req, res) => {
  try {
    const nuevaSesion = new Sesion(req.body);
    await nuevaSesion.save();
    res.status(201).json({ message: "Sesión creada con éxito." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una sesión por ID
exports.updateSesion = async (req, res) => {
  try {
    const sesionActualizada = await Sesion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Retorna el documento actualizado
    );
    if (!sesionActualizada) {
      return res.status(404).json({ error: "Sesión no encontrada." });
    }
    res.status(200).json({ message: "Sesión actualizada con éxito.", sesion: sesionActualizada });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una sesión por ID
exports.eliminarSesion = async (req, res) => {
    try {
      const sesionId = req.params.id;
  
      const resultado = await Sesion.findByIdAndDelete(sesionId);
      if (!resultado) {
        return res.status(404).json({ error: `Sesión con ID ${sesionId} no encontrada.` });
      }
  
      res.status(200).json({ message: `Sesión con ID ${sesionId} eliminada.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.importarSesiones = async (req, res) => {
    try {
      const sesiones = req.body; // El JSON completo debe enviarse en el cuerpo de la solicitud
  
      if (!Array.isArray(sesiones)) {
        return res.status(400).json({ error: "El cuerpo debe ser un array de sesiones." });
      }
  
      const errores = [];
      const exitos = [];
  
      for (const sesion of sesiones) {
        try {
          console.log(`Procesando sesión: ${JSON.stringify(sesion)}`);
          const nuevaSesion = new Sesion(sesion);
          await nuevaSesion.save();
          exitos.push(`Sesión con ID ${sesion._id} creada.`);
        } catch (error) {
          errores.push(`Error con la sesión ID ${sesion._id}: ${error.message}`);
        }
      }
  
      res.status(201).json({ message: "Importación completada.", exitos, errores });
    } catch (error) {
      console.error(`Error en la importación: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };
  
