const Menu = require("../models/menu");
const PuestoComida = require("../models/puestoComida");

exports.importarMenus = async (req, res) => {
  try {
    const menus = req.body; // Los menús deben venir como un array en el cuerpo de la solicitud

    if (!Array.isArray(menus)) {
      return res.status(400).json({ error: "El cuerpo debe ser un array de menús." });
    }

    const errores = [];
    const exitos = [];

    for (const menu of menus) {
      try {
        console.log(`Procesando menú: ${JSON.stringify(menu)}`);
        const nuevoMenu = new Menu(menu);
        await nuevoMenu.save();
        exitos.push(`Menú con ID ${menu._id} creado.`);
      } catch (error) {
        errores.push(`Error con el menú ID ${menu._id || menu.id_menu}: ${error.message}`);
      }
    }

    res.status(201).json({ message: "Proceso completado.", exitos, errores });
  } catch (error) {
    console.error(`Error en la importación: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarMenu = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Verificar si el menú está referenciado en `puestos_comida`
      const referencia = await PuestoComida.findOne({ idMenu: id });
  
      if (referencia) {
        return res.status(400).json({
          error: `No se puede eliminar el menú ${id} porque está referenciado en un puesto de comida.`,
        });
      }
  
      // Eliminar el menú
      const menuEliminado = await Menu.findByIdAndDelete(id);
  
      if (!menuEliminado) {
        return res.status(404).json({ error: `Menú con ID ${id} no encontrado.` });
      }
  
      res.status(200).json({ message: `Menú con ID ${id} eliminado exitosamente.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

exports.actualizarMenu = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
  
    try {
      const menuActualizado = await Menu.findByIdAndUpdate(id, datosActualizados, {
        new: true,
      });
  
      if (!menuActualizado) {
        return res.status(404).json({ error: `Menú con ID ${id} no encontrado.` });
      }
  
      res.status(200).json({
        message: `Menú con ID ${id} actualizado exitosamente.`,
        menu: menuActualizado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};
  