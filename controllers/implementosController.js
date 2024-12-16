const Implemento = require("../models/implemento");
const Sesion = require("../models/sesion");

exports.importarImplementos = async (req, res) => {
  try {
    const implementos = req.body;

    if (!Array.isArray(implementos)) {
      return res.status(400).json({ error: "El cuerpo debe ser un array de implementos." });
    }

    const errores = [];
    const exitos = [];

    for (const implemento of implementos) {
      try {
        const nuevoImplemento = new Implemento(implemento);
        await nuevoImplemento.save();
        exitos.push(`Implemento con ID ${implemento._id} creado.`);
      } catch (error) {
        errores.push(`Error con el implemento ID ${implemento._id}: ${error.message}`);
      }
    }

    res.status(201).json({ message: "Proceso completado.", exitos, errores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarImplemento = async (req, res) => {
    try {
      const implementoId = parseInt(req.params.id, 10); // Convertir el ID a número si es necesario
  
      // Verificar si el implemento está referenciado en `usuarioXimplemento` dentro de `Sesion`
      const implementoAsignado = await Sesion.findOne({
        "usuarioXimplemento.id_implemento": implementoId,
      });
  
      if (implementoAsignado) {
        return res.status(400).json({
          error: `No se puede eliminar el implemento con ID ${implementoId}, ya que está referenciado en una o más sesiones.`,
        });
      }
  
      // Si no está referenciado, proceder con la eliminación
      const resultado = await Implemento.findByIdAndDelete(implementoId);
  
      if (!resultado) {
        return res.status(404).json({ error: `Implemento con ID ${implementoId} no encontrado.` });
      }
  
      res.status(200).json({ message: `Implemento con ID ${implementoId} eliminado.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};
  
  
  exports.actualizarImplemento = async (req, res) => {
    const { id } = req.params; // ID del implemento a actualizar
    const datosActualizados = req.body; // Nuevos datos para el implemento
  
    try {
      // Buscar el implemento existente
      const implemento = await Implemento.findById(id);
  
      if (!implemento) {
        return res.status(404).json({ error: `Implemento con ID ${id} no encontrado.` });
      }
  
      // Actualizar el implemento
      const implementoActualizado = await Implemento.findByIdAndUpdate(id, datosActualizados, {
        new: true, // Retorna el documento actualizado
      });
  
      // Actualizar referencias en Sesion
      if (datosActualizados._id) {
        await Sesion.updateMany(
          { "usearioXimplemento.id_implemento": id },
          { $set: { "usearioXimplemento.$.id_implemento": datosActualizados._id } }
        );
      }
  
      res.status(200).json({
        message: `Implemento con ID ${id} actualizado exitosamente.`,
        implemento: implementoActualizado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  