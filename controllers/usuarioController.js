const Usuario = require("../models/usuario");
const PuestoComida = require("../models/puestoComida");

exports.importarUsuarios = async (req, res) => {
  try {
    const usuarios = req.body;

    if (!Array.isArray(usuarios)) {
      return res.status(400).json({ error: "El cuerpo debe ser un array de usuarios." });
    }

    const errores = [];
    const exitos = [];

    for (const usuario of usuarios) {
        try {
          const nuevoUsuario = new Usuario(usuario);
          await nuevoUsuario.save();
          exitos.push(`Usuario con ID ${usuario._id} creado.`);
        } catch (error) {
          errores.push(`Error con el usuario ID ${usuario._id}: ${error.message}`);
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
    // Verificar si el usuario está referenciado en `puestos_comida`
    const referencia = await PuestoComida.findOne({ "resenas.idUsuario": id });

    if (referencia) {
      return res.status(400).json({
        error: `No se puede eliminar el usuario ${id} porque está referenciado en reseñas.`,
      });
    }

    // Eliminar el usuario
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ error: `Usuario con ID ${id} no encontrado.` });
    }

    res.status(200).json({ message: `Usuario con ID ${id} eliminado exitosamente.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
  
    try {
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        id,
        datosActualizados,
        { new: true }
      );
  
      if (!usuarioActualizado) {
        return res.status(404).json({ error: `Usuario con ID ${id} no encontrado.` });
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
  