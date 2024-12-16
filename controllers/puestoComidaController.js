const PuestoComida = require("../models/puestoComida");
const Menu = require("../models/menu");
const Usuario = require("../models/usuario");

exports.crearPuestoComida = async (req, res) => {
  try {
    const nuevoPuesto = new PuestoComida(req.body);
    await nuevoPuesto.save();
    res.status(201).json({ message: "Puesto de comida creado exitosamente." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.obtenerPuestosComida = async (req, res) => {
    try {
      const puestos = await PuestoComida.find()
        .populate("idMenu") // Expandir la relación con el menú
        .populate("resenas.idUsuario"); // Expandir la relación con los usuarios
  
      res.status(200).json(puestos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.actualizarPuestoComida = async (req, res) => {
  try {
    const { id } = req.params;
    const puestoActualizado = await PuestoComida.findOneAndUpdate(
      { id_puesto_comida: id },
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Puesto de comida actualizado.", puestoActualizado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarPuestoComida = async (req, res) => {
  try {
    const { id } = req.params;
    const puesto = await PuestoComida.findOne({ id_puesto_comida: id });
    if (!puesto) {
      return res.status(404).json({ error: "Puesto de comida no encontrado." });
    }

    await puesto.remove();
    res.status(200).json({ message: "Puesto de comida eliminado." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.importarPuestosComida = async (req, res) => {
    try {
        const puestos = req.body;

        if (!Array.isArray(puestos)) {
            return res.status(400).json({ error: "El cuerpo debe ser un array de puestos de comida." });
        }

        const errores = [];
        const exitos = [];

        for (let puesto of puestos) {
            try {
                // Procesar las fechas en las reseñas
                if (Array.isArray(puesto.resenas)) {
                    puesto.resenas = puesto.resenas.map((resena) => {
                        if (typeof resena.fecha === "string") {
                            const [day, month, year] = resena.fecha.split("/");
                            resena.fecha = new Date(`${year}-${month}-${day}`);
                            if (isNaN(resena.fecha)) {
                                throw new Error(`El formato de fecha "${resena.fecha}" en la reseña no es válido.`);
                            }
                        }
                        return resena;
                    });
                }

                // Crear el puesto de comida
                const nuevoPuesto = new PuestoComida(puesto);
                await nuevoPuesto.save();
                exitos.push(`Puesto de comida con ID ${puesto.id_puesto_comida} creado.`);
            } catch (error) {
                errores.push(`Error con el puesto de comida ID ${puesto.id_puesto_comida}: ${error.message}`);
            }
        }

        res.status(201).json({ message: "Proceso completado.", exitos, errores });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

   
exports.obtenerPuestosComida = async (req, res) => {
  try {
    // Buscar puestos y popular referencias de `idMenu` y `resenas.idUsuario`
    const puestos = await PuestoComida.find()
      .populate("idMenu") // Expande los menús referenciados
      .populate("resenas.idUsuario"); // Expande los usuarios referenciados en reseñas

    res.status(200).json(puestos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
