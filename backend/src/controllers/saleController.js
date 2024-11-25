// src/controllers/saleController.js
const db = require('../config/db');

// Registrar una nueva venta con múltiples productos
const createSale = (req, res) => {
  const { usuarioId, proyectoId, productos } = req.body;

  if (!usuarioId || !proyectoId || !productos || !Array.isArray(productos) || productos.length === 0) {
    console.log('Datos faltantes:', { usuarioId, proyectoId, productos });
    return res.status(400).json({ message: 'Por favor, proporciona todos los datos necesarios para registrar la venta' });
  }

  // Comenzar la transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar la transacción:', err);
      return res.status(500).json({ message: 'Error al iniciar la transacción' });
    }

    // Insertar la venta en la tabla Ventas
    const insertSaleQuery = `INSERT INTO Ventas (usuario_id, proyecto_id, fecha) VALUES (?, ?, ?)`;
    const fecha = new Date();
    db.query(insertSaleQuery, [usuarioId, proyectoId, fecha], (err, result) => {
      if (err) {
        console.error('Error al registrar la venta:', err);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error al registrar la venta' });
        });
      }

      const ventaId = result.insertId;

      // Procesar cada producto para la venta
      const detallesVentaPromises = productos.map((producto) => {
        return new Promise((resolve, reject) => {
          const { productoId, cantidadVendida } = producto;

          // Verificar que hay suficiente inventario en ProductosProyectos
          const checkStockQuery = `SELECT cantidad, precio_unitario_venta FROM ProductosProyectos INNER JOIN Productos ON ProductosProyectos.producto_id = Productos.id WHERE proyecto_id = ? AND producto_id = ?`;
          db.query(checkStockQuery, [proyectoId, productoId], (err, results) => {
            if (err) {
              return reject({ message: 'Error al verificar el inventario', error: err });
            }

            if (results.length === 0 || results[0].cantidad < cantidadVendida) {
              return reject({ message: 'Cantidad insuficiente en inventario', productoId });
            }

            const precioUnitario = results[0].precio_unitario_venta;
         
            

            
            const total = precioUnitario * cantidadVendida;

  

            // Actualizar la cantidad en ProductosProyectos
            const updateStockQuery = `UPDATE ProductosProyectos SET cantidad = cantidad - ? WHERE proyecto_id = ? AND producto_id = ?`;
            db.query(updateStockQuery, [cantidadVendida, proyectoId, productoId], (err) => {
              if (err) {
                return reject({ message: 'Error al actualizar el inventario', error: err });
              }

              // Insertar el detalle de la venta en la tabla DetallesVenta
              const insertDetailQuery = `INSERT INTO DetallesVenta (venta_id, producto_id, cantidad_vendida, total) VALUES (?, ?, ?, ?)`;
              db.query(insertDetailQuery, [ventaId, productoId, cantidadVendida, total], (err) => {
                if (err) {
                  return reject({ message: 'Error al registrar el detalle de la venta', error: err });
                }
                resolve();
              });
            });
          });
        });
      });

      // Ejecutar todas las promesas de los detalles de venta
      Promise.all(detallesVentaPromises)
        .then(() => {
          // Confirmar la transacción
          db.commit((err) => {
            if (err) {
              console.error('Error al confirmar la transacción:', err);
              return db.rollback(() => {
                res.status(500).json({ message: 'Error al confirmar la transacción' });
              });
            }

            console.log('Venta registrada exitosamente con múltiples productos:', { usuarioId, proyectoId, productos });
            res.status(201).json({ message: 'Venta registrada exitosamente', ventaId });
          });
        })
        .catch((error) => {
          console.error('Error durante el registro de los detalles de la venta:', error);
          db.rollback(() => {
            res.status(500).json({ message: error.message });
          });
        });
    });
  });
};

// Obtener todas las ventas del día para un proyecto
// Obtener todas las ventas del día para un proyecto
const getVentasDelDia = (req, res) => {
  const { projectId } = req.params;
  console.log("projectId", projectId);

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  console.log("startOfDay", startOfDay);
  console.log("endOfDay", endOfDay);

  const query = `
    SELECT Ventas.id AS venta_id, Ventas.fecha, Productos.id AS producto_id, Productos.nombre AS nombre_producto, DetallesVenta.cantidad_vendida, DetallesVenta.total
    FROM Ventas
    INNER JOIN DetallesVenta ON Ventas.id = DetallesVenta.venta_id
    INNER JOIN Productos ON DetallesVenta.producto_id = Productos.id
    WHERE Ventas.proyecto_id = ? AND Ventas.fecha BETWEEN ? AND ?`;

  db.query(query, [projectId, startOfDay, endOfDay], (err, results) => {
    if (err) {
      console.error('Error al obtener las ventas del día:', err);
      return res.status(500).json({ message: 'Error al obtener las ventas del día' });
    }

    // Agrupar los detalles de las ventas por venta_id
    const ventasMap = new Map();
    results.forEach((row) => {
      if (!ventasMap.has(row.venta_id)) {
        ventasMap.set(row.venta_id, {
          venta_id: row.venta_id,
          fecha: row.fecha,
          detalles: [],
        });
      }
      ventasMap.get(row.venta_id).detalles.push({
        producto_id: row.producto_id,
        nombre_producto: row.nombre_producto,
        cantidad_vendida: row.cantidad_vendida,
        total: row.total,
      });
    });

    const ventas = Array.from(ventasMap.values());
    res.status(200).json(ventas);
  });
};

// Obtener todas las ventas
const getAllSales = (req, res) => {
  const query = 'SELECT * FROM Ventas';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las ventas' });
    }
    res.status(200).json(results);
  });
};
// Obtener reporte de ventas por rango de fechas, agrupado por día
const getReporteVentasPorRango = (req, res) => {
  const { projectId } = req.params;
  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ message: "Debe proporcionar una fecha de inicio y una fecha de fin" });
  }

  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  end.setHours(23, 59, 59, 999); // Asegurarse de que la fecha de fin incluya todo el día

  const query = `
    SELECT DATE_FORMAT(Ventas.fecha, '%Y-%m-%d') AS fecha_dia,
           SUM(DetallesVenta.total) AS total_vendido,
           GROUP_CONCAT(
             CONCAT(
               '{"nombre_producto": "', Productos.nombre, '",',
               '"cantidad_vendida": ', DetallesVenta.cantidad_vendida, ',',
               '"total": ', DetallesVenta.total, '}'
             )
           ) AS detalles
    FROM Ventas
    INNER JOIN DetallesVenta ON Ventas.id = DetallesVenta.venta_id
    INNER JOIN Productos ON DetallesVenta.producto_id = Productos.id
    WHERE Ventas.proyecto_id = ? AND Ventas.fecha BETWEEN ? AND ?
    GROUP BY DATE(Ventas.fecha)
    ORDER BY fecha_dia;
  `;

  db.query(query, [projectId, start, end], (err, results) => {
    if (err) {
      console.error("Error al obtener el reporte de ventas:", err);
      return res.status(500).json({ message: "Error al obtener el reporte de ventas" });
    }

    // Convertir el resultado de la cadena JSON en un array para cada venta
    const reporte = results.map((row) => ({
      fecha_dia: row.fecha_dia, // Devolver la fecha en formato ISO 'YYYY-MM-DD'
      total_vendido: Number(row.total_vendido).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      detalles: row.detalles ? JSON.parse(`[${row.detalles}]`) : [],
    }));

    res.status(200).json(reporte);
  });
};


module.exports = { createSale, getVentasDelDia, getAllSales, getReporteVentasPorRango };
