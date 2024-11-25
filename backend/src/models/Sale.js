// src/models/Sale.js
const db = require('../config/db');

const Sale = {
  create: (saleData, callback) => {
    const { userId, projectId, totalAmount } = saleData;
    const query = `INSERT INTO Ventas (usuario_id, proyecto_id, monto_total) VALUES (?, ?, ?)`;
    db.query(query, [userId, projectId, totalAmount], callback);
  },

  addSaleDetails: (saleId, products, callback) => {
    const query = `INSERT INTO DetallesVentas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ?`;
    const values = products.map((product) => [
      saleId,
      product.productId,
      product.quantity,
      product.unitPrice,
      product.subtotal,
    ]);
    db.query(query, [values], callback);
  },
};

module.exports = Sale;
