const express = require("express");
const mongoose = require("mongoose");
const empleadoXcarroRoutes = require("./routes/empXcarroRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const pistaRoutes = require("./routes/pistaRoutes");
const puestoComida = require("./routes/puestoComida");
const usuarioRoutes = require("./routes/usuarioRoutes");
const menuRoutes = require("./routes/menuRoutes");
const mantenimientoRoutes = require("./routes/mantenimientoRoutes");
const empXMantenimientoRoutes = require("./routes/empXmantenimientoRoutes");
const implementoRoutes = require("./routes/implementosRoutes");
const sesionesRoutes = require("./routes/sesionRoutes");

const proveedorRoutes = require("./routes/proveedorRoutes");
const repuestoRoutes = require("./routes/repuestoRoutes");
const provXrepuestoRoutes = require("./routes/provXrepuestoRoutes");
const metodoPagoRoutes = require("./routes/metodoPagoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");

const app = express();
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect("mongodb://localhost:27017/zona_karting", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Rutas
app.use("/api/empleadoXcarro", empleadoXcarroRoutes);
app.use("/api", empleadoRoutes);
app.use("/api/pistas", pistaRoutes);
app.use("/api/puestoComida", puestoComida),
  app.use("/api", usuarioRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/mantenimientos", mantenimientoRoutes);
app.use('/api/empXMantenimientos', empXMantenimientoRoutes);
app.use('/api/implementos', implementoRoutes);
app.use('/api', sesionesRoutes)
app.use('/api/metodosPago', metodoPagoRoutes);

app.use("/api/proveedores", proveedorRoutes);
app.use("/api/repuestos", repuestoRoutes);
app.use("/api/provxrepuestos", provXrepuestoRoutes);
app.use("/api/facturas", facturaRoutes);

module.exports = app;

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
