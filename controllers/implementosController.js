const Implemento = require("../models/implemento");

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
