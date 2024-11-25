// src/routes/inventoryRoutes.js
const express = require('express');
const { updateInventory, getInventory } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para actualizar el inventario (solo administradores y operarios)
router.put('/', protect, authorize('administrador', 'operario'), updateInventory);

// Ruta para obtener el inventario de un producto específico (todos los roles pueden acceder)
router.get('/:productId', protect, getInventory);

module.exports = router;
