const express = require("express");
const mongoose = require("mongoose");
const empleadoXcarroRoutes = require("./routes/empXcarroRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const pistaRoutes = require("./routes/pistaRoutes");

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

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
