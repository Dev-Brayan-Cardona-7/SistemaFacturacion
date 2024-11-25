// src/app.js
const dotenv = require('dotenv');
dotenv.config();  // Asegúrate de que esto esté al principio
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const projectRoutes = require('./routes/projectRoutes'); // Rutas de proyectos
const productRoutes = require('./routes/productRoutes'); // Rutas de productos
const saleRoutes = require('./routes/saleRoutes'); // Rutas de ventas
const inventoryRoutes = require('./routes/inventoryRoutes'); // Rutas de inventario

const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para manejar datos en formato JSON

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL.');
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
  
});

// Registrar rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/products', productRoutes); // Rutas de productos
app.use('/api/sales', saleRoutes); // Rutas de ventas
app.use('/api/inventory', inventoryRoutes); // Rutas de inventario
app.use('/api/projects', projectRoutes); // Rutas de proyectos

module.exports = app;
