// src/routes/productRoutes.js
const express = require('express');
const { getProductsByProjectId } = require('../controllers/productController');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para obtener todos los productos (pública)
router.get('/', getAllProducts);

// Ruta para crear un nuevo producto (solo administradores)
router.post('/', protect, authorize('administrador'), createProduct);

// Ruta para actualizar un producto (solo administradores)
router.put('/:id', protect, authorize('administrador'), updateProduct);

// Ruta para eliminar un producto (solo administradores)
router.delete('/:id', protect, authorize('administrador'), deleteProduct);

// Ruta para obtener los productos de un proyecto específico
router.get('/projects/:projectId', protect, authorize('administrador', 'operario'), getProductsByProjectId);

module.exports = router;
