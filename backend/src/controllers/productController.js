// src/controllers/productController.js
const db = require('../config/db');

// Obtener todos los productos
const getAllProducts = (req, res) => {
  const query = 'SELECT * FROM Productos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los productos' });
    }
    res.status(200).json(results);
  });
};

// Crear un nuevo producto
const createProduct = (req, res) => {
  const { nombre, descripcion, precio_unitario_proveedor, precio_unitario_venta, proveedor_id, proyectoId, cantidad } = req.body;

  // Verificar que todos los campos obligatorios estén presentes
  if (!nombre || !precio_unitario_proveedor || !precio_unitario_venta || !proyectoId || !cantidad) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos obligatorios' });
  }

  console.log("Datos recibidos para crear el producto:", req.body);

  // Insertar el producto en la tabla Productos
  const query = `INSERT INTO Productos (nombre, descripcion, precio_unitario_proveedor, precio_unitario_venta, proveedor_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [nombre, descripcion, precio_unitario_proveedor, precio_unitario_venta, proveedor_id], (err, result) => {
    if (err) {
      console.error("Error al crear el producto en la tabla Productos:", err);
      return res.status(500).json({ message: 'Error al crear el producto' });
    }

    const productoId = result.insertId;

    // Insertar la relación en ProductosProyectos
    const queryRelacion = `INSERT INTO ProductosProyectos (proyecto_id, producto_id, cantidad) VALUES (?, ?, ?)`;
    db.query(queryRelacion, [proyectoId, productoId, cantidad], (err) => {
      if (err) {
        console.error("Error al asociar el producto con el proyecto en ProductosProyectos:", err);
        return res.status(500).json({ message: 'Error al asociar el producto con el proyecto' });
      }
      res.status(201).json({ message: 'Producto creado y asociado exitosamente' });
    });
  });
};


// Actualizar un producto existente
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio_unitario_proveedor, precio_unitario_venta, proveedor_id, cantidad, proyectoId } = req.body;

  if (!nombre || !precio_unitario_proveedor || !precio_unitario_venta || !cantidad || !proyectoId) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos obligatorios' });
  }

  // Actualizar la tabla Productos
  const query = `UPDATE Productos SET nombre = ?, descripcion = ?, precio_unitario_proveedor = ?, precio_unitario_venta = ?, proveedor_id = ? WHERE id = ?`;
  db.query(query, [nombre, descripcion, precio_unitario_proveedor, precio_unitario_venta, proveedor_id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el producto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar la relación en ProductosProyectos
    const queryRelacion = `UPDATE ProductosProyectos SET cantidad = ? WHERE producto_id = ? AND proyecto_id = ?`;
    db.query(queryRelacion, [cantidad, id, proyectoId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al actualizar la relación del producto con el proyecto' });
      }
      res.status(200).json({ message: 'Producto y relación actualizados exitosamente' });
    });
  });
};



// Eliminar un producto
const deleteProduct = (req, res) => {
  const { id } = req.params;

  // Primero eliminar la relación en ProductosProyectos
  const deleteRelacionQuery = `DELETE FROM ProductosProyectos WHERE producto_id = ?`;
  db.query(deleteRelacionQuery, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar la relación del producto en ProductosProyectos:", err);
      return res.status(500).json({ message: 'Error al eliminar la relación del producto con el proyecto' });
    }

    // Después eliminar el producto en la tabla Productos
    const deleteProductQuery = `DELETE FROM Productos WHERE id = ?`;
    db.query(deleteProductQuery, [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar el producto en la tabla Productos:", err);
        return res.status(500).json({ message: 'Error al eliminar el producto' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    });
  });
};


// Obtener productos asignados a un proyecto específico con todos los campos de la tabla Productos
const getProductsByProjectId = (req, res) => {
  const { projectId } = req.params;

  const query = `SELECT Productos.*, ProductosProyectos.cantidad
                 FROM Productos
                 INNER JOIN ProductosProyectos ON Productos.id = ProductosProyectos.producto_id
                 WHERE ProductosProyectos.proyecto_id = ?`;

  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los productos del proyecto' });
    }
    res.status(200).json(results);
  });
};

module.exports = { getProductsByProjectId, getAllProducts, createProduct, updateProduct, deleteProduct };
