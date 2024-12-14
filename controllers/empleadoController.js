const Empleado = require("../models/empleado");

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
