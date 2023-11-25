require('dotenv').config()
const express = require('express');
const roomRoutes = require('./routes/roomRoutes');
const reserveRoutes = require('./routes/reserveRoutes');
const V1SwaggerDocs = require('./routes/swagger');

const app = express();
app.use(express.json());

app.use('/', roomRoutes);
app.use('/', reserveRoutes);
V1SwaggerDocs(app);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
