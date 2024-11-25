// src/controllers/inventoryController.js
const db = require('../config/db');

// Actualizar inventario (incrementar cantidad)
const updateInventory = (req, res) => {
    const { productId, quantity } = req.body;
  
    if (!productId || quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Por favor, proporciona un ID de producto y una cantidad válida' });
    }
  
    const query = `UPDATE Inventario SET cantidad_stock = ? WHERE producto_id = ?`;
    db.query(query, [quantity, productId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al actualizar el inventario' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Inventario actualizado exitosamente' });
    });
  };

// Consultar el inventario de un producto específico
const getInventory = (req, res) => {
  const { productId } = req.params;

  const query = `SELECT * FROM Inventario WHERE producto_id = ?`;
  db.query(query, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el inventario' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado en el inventario' });
    }
    res.status(200).json(results[0]);
  });
};

module.exports = { updateInventory, getInventory };
