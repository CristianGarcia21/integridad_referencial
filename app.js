const express = require("express");
const mongoose = require("mongoose");
const empleadoXcarroRoutes = require("./routes/empXcarroRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const pistaRoutes = require("./routes/pistaRoutes");
const puestoComida = require("./routes/puestoComida");
const usuarioRoutes = require("./routes/usuarioRoutes");
const menuRoutes = require("./routes/menuRoutes");
const mantenimiento = require("./models/mantenimiento");

const app = express();
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect("mongodb://localhost:27017/zona_karting", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Rutas
app.use("/api/empleadoXcarro", empleadoXcarroRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/pistas", pistaRoutes);
app.use("/api/puestoComida", puestoComida),
  app.use("/api/usuarios", usuarioRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);
app.use('/api/empXMantenimientos', empXMantenimientoRoutes);
app.use('/api/repuestos', repuestoRoutes);
app.use('/api/metodosPago', metodoPagoRoutes);


module.exports = app;

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
