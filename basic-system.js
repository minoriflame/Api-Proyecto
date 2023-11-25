// variables de entorno
require('dotenv').config()

// Servidor
const express = require('express');

// Rutas
const roomRoutes = require('./routes/roomRoutes');
const reserveRoutes = require('./routes/reserveRoutes');

const app = express();
app.use(express.json());

app.use('/', roomRoutes);
app.use('/', reserveRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
