const Empleado = require("../models/empleado");
const Sesion = require("../models/sesion");

// Cargar múltiples empleados desde un JSON
exports.cargarEmpleadosDesdeJSON = async (req, res) => {
  try {
    const empleados = req.body;

    // Validar que sea un arreglo
    if (!Array.isArray(empleados)) {
      return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de empleados." });
    }

    const errores = [];
    const exitos = [];

    for (const empleado of empleados) {
      try {
        const { _id, nombre, apellido, telefono, direccion, rol } = empleado;

        // Validar que los campos obligatorios estén presentes
        if (!_id || !nombre || !apellido || !telefono || !direccion || !rol) {
          throw new Error(`Faltan campos obligatorios para el empleado con ID ${_id || "desconocido"}.`);
        }

        // Validar que el rol sea válido
        const rolesValidos = ["Venta Comida", "Mantenimiento", "Bodega", "Vehículos Emerg.", "Taquilla"];
        if (!rolesValidos.includes(rol)) {
          throw new Error(`Rol inválido para el empleado con ID ${_id}: debe ser uno de ${rolesValidos.join(", ")}.`);
        }

        // Verificar si el empleado ya existe
        const empleadoExistente = await Empleado.findById(_id);
        if (empleadoExistente) {
          throw new Error(`El empleado con ID ${_id} ya existe.`);
        }

        // Crear e insertar el nuevo empleado
        const nuevoEmpleado = new Empleado({ _id, nombre, apellido, telefono, direccion, rol });
        await nuevoEmpleado.save();
        exitos.push(`Empleado con ID ${_id} creado correctamente.`);
      } catch (error) {
        errores.push(error.message);
      }
    }

    res.status(201).json({ message: "Proceso completado.", exitos, errores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarEmpleado = async (req, res) => {
    try {
      const empleadoId = parseInt(req.params.id, 10); // Asegurar que el ID sea un número
  
      // Verificar si el empleado está referenciado en `ced_empleado` o en `usuarioXimplemento.ced_empleado`
      const sesionConEmpleado = await Sesion.findOne({ ced_empleado: empleadoId });
      const implementoAsignado = await Sesion.findOne({
        "usuarioXimplemento.ced_empleado": empleadoId,
      });
  
      if (sesionConEmpleado || implementoAsignado) {
        return res.status(400).json({
          error: `No se puede eliminar el empleado con ID ${empleadoId}, ya que está referenciado en una o más sesiones o asignaciones de implementos.`,
        });
      }
  
      // Proceder con la eliminación del empleado
      const resultado = await Empleado.findByIdAndDelete(empleadoId);
  
      if (!resultado) {
        return res.status(404).json({ error: `Empleado con ID ${empleadoId} no encontrado.` });
      }
  
      res.status(200).json({ message: `Empleado con ID ${empleadoId} eliminado.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
exports.actualizarEmpleado = async (req, res) => {
    const { id } = req.params; // ID del empleado a actualizar
    const datosActualizados = req.body; // Nuevos datos para el empleado
  
    try {
      // Buscar el empleado existente
      const empleado = await Empleado.findById(id);
  
      if (!empleado) {
        return res.status(404).json({ error: `Empleado con ID ${id} no encontrado.` });
      }
  
      // Actualizar el empleado
      const empleadoActualizado = await Empleado.findByIdAndUpdate(id, datosActualizados, {
        new: true, // Retorna el documento actualizado
      });
  
      // Actualizar referencias en Sesion
      if (datosActualizados._id) {
        await Sesion.updateMany(
          { ced_empleado: id },
          { $set: { ced_empleado: datosActualizados._id } }
        );
      }
  
      res.status(200).json({
        message: `Empleado con ID ${id} actualizado exitosamente.`,
        empleado: empleadoActualizado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};
  