// src/server.js
const dotenv = require('dotenv');
dotenv.config(); // Importar y configurar dotenv al principio

const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
