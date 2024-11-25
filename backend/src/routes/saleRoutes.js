// src/routes/saleRoutes.js
const express = require('express');
const { createSale, getVentasDelDia , getReporteVentasPorRango} = require('../controllers/saleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear una nueva venta (solo administradores y operarios)
router.post('/', protect, authorize('administrador', 'operario'), createSale);

// Ruta para obtener las ventas del día para un proyecto
router.get('/projects/:projectId/today', protect, authorize('administrador', 'operario'), getVentasDelDia);

// Ruta para obtener las ventas por rango de fechas para un proyecto
router.get('/projects/:projectId/reports', protect, authorize('administrador', 'operario'), getReporteVentasPorRango);


module.exports = router;










/*
const express = require('express');
const { createSale, getAllSales } = require('../controllers/saleController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar una nueva venta (solo administradores y operarios)
router.post('/', protect, authorize('administrador', 'operario'), createSale);

// Ruta para obtener todas las ventas (solo administradores)
router.get('/', protect, authorize('administrador'), getAllSales);

module.exports = router;*/

