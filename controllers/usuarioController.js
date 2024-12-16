const Usuario = require("../models/usuario");
const PuestoComida = require("../models/puestoComida");
const Sesion = require("../models/sesion");

exports.importarUsuarios = async (req, res) => {
  try {
    const usuarios = req.body;

    if (!Array.isArray(usuarios)) {
      return res
        .status(400)
        .json({ error: "El cuerpo debe ser un array de usuarios." });
    }

    const errores = [];
    const exitos = [];

    for (const usuario of usuarios) {
      try {
        const nuevoUsuario = new Usuario(usuario);
        await nuevoUsuario.save();
        exitos.push(`Usuario con ID ${usuario._id} creado.`);
      } catch (error) {
        errores.push(
          `Error con el usuario ID ${usuario._id}: ${error.message}`
        );
      }
    }

    res.status(201).json({ message: "Proceso completado.", exitos, errores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el usuario está referenciado en `PuestoComida`
    const referenciaPuestoComida = await PuestoComida.findOne({
      "resenas.idUsuario": id,
    });

    if (referenciaPuestoComida) {
      return res.status(400).json({
        error: `No se puede eliminar el usuario ${id} porque está referenciado en reseñas de Puestos de Comida.`,
      });
    }

    // Verificar si el usuario está referenciado en `Sesion`
    const referenciaSesion = await Sesion.findOne({
      $or: [{ id_usuario: id }, { "usearioXimplemento.id_usuario": id }],
    });

    if (referenciaSesion) {
      return res.status(400).json({
        error: `No se puede eliminar el usuario ${id} porque está referenciado en una o más sesiones.`,
      });
    }

    // Eliminar el usuario
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res
        .status(404)
        .json({ error: `Usuario con ID ${id} no encontrado.` });
    }

    res
      .status(200)
      .json({ message: `Usuario con ID ${id} eliminado exitosamente.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params; // ID del usuario a actualizar
  const datosActualizados = req.body; // Nuevos datos para el usuario

  try {
    // Buscar el usuario existente
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res
        .status(404)
        .json({ error: `Usuario con ID ${id} no encontrado.` });
    }

    // Actualizar el usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true } // Devuelve el documento actualizado
    );

    // Si el `_id` del usuario cambia, actualizar referencias en otras colecciones
    if (datosActualizados._id && datosActualizados._id !== id) {
      // Actualizar referencias en la colección `Sesion`
      await Sesion.updateMany(
        { id_usuario: id },
        { $set: { "id_usuario.$": datosActualizados._id } }
      );
    }

    res.status(200).json({
      message: `Usuario con ID ${id} actualizado exitosamente.`,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
