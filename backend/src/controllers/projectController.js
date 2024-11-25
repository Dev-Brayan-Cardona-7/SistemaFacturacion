// src/controllers/projectController.js
const db = require('../config/db');

// Crear un nuevo proyecto
const createProject = (req, res) => {
  const { nombre, descripcion, clienteId, fechaInicio, fechaFin } = req.body;

  if (!nombre || !clienteId) {
    return res.status(400).json({ message: 'Por favor, proporciona un nombre y un ID de cliente' });
  }

  const query = `INSERT INTO Proyectos (nombre, descripcion, cliente_id, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [nombre, descripcion, clienteId, fechaInicio, fechaFin], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el proyecto' });
    }
    res.status(201).json({ message: 'Proyecto creado exitosamente', projectId: result.insertId });
  });
};

// Obtener todos los proyectos
const getAllProjects = (req, res) => {
  const query = `SELECT * FROM Proyectos`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
    res.status(200).json(results);
  });
};

// Obtener un proyecto específico
const getProjectById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM Proyectos WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener el proyecto' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json(results[0]);
  });
};

// Actualizar un proyecto
const updateProject = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, clienteId, fechaInicio, fechaFin } = req.body;

  if (!nombre || !clienteId) {
    return res.status(400).json({ message: 'Por favor, proporciona un nombre y un ID de cliente' });
  }

  const query = `UPDATE Proyectos SET nombre = ?, descripcion = ?, cliente_id = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?`;
  db.query(query, [nombre, descripcion, clienteId, fechaInicio, fechaFin, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el proyecto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json({ message: 'Proyecto actualizado exitosamente' });
  });
};

// Eliminar un proyecto
const deleteProject = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM Proyectos WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el proyecto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(200).json({ message: 'Proyecto eliminado exitosamente' });
  });
};

// Asignar usuarios a un proyecto
const assignUsersToProject = (req, res) => {
  const { proyectoId, usuarioIds } = req.body;

  if (!proyectoId || !usuarioIds || !Array.isArray(usuarioIds)) {
    return res.status(400).json({ message: 'Proporciona un ID de proyecto y una lista de IDs de usuarios' });
  }

  const values = usuarioIds.map((userId) => [proyectoId, userId]);
  const query = `INSERT INTO Proyectos_Usuarios (proyecto_id, usuario_id) VALUES ?`;

  db.query(query, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al asignar usuarios al proyecto' });
    }
    res.status(200).json({ message: 'Usuarios asignados al proyecto exitosamente' });
  });
};

// Obtener usuarios asignados a un proyecto
const getUsersByProjectId = (req, res) => {
  const { proyectoId } = req.params;

  const query = `SELECT Usuarios.id, Usuarios.nombre FROM Usuarios 
                 INNER JOIN Proyectos_Usuarios ON Usuarios.id = Proyectos_Usuarios.usuario_id
                 WHERE Proyectos_Usuarios.proyecto_id = ?`;

  db.query(query, [proyectoId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los usuarios del proyecto' });
    }
    res.status(200).json(results);
  });
};



// Obtener productos asignados a un proyecto específico
const getProductsByProjectId = (req, res) => {
  const { projectId } = req.params;

  const query = `SELECT Productos.id, Productos.nombre, ProductosProyectos.cantidad
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
//obtener los proyectos de un usuario
const getProjectsByUserId = (req, res) => {
  const { userId } = req.params;
  console.log('ID del usuario:', userId);  // Verificar que el userId llega correctamente

  const query = `SELECT Proyectos.id, Proyectos.nombre, Proyectos.descripcion
                 FROM Proyectos
                 INNER JOIN Proyectos_Usuarios ON Proyectos.id = Proyectos_Usuarios.proyecto_id
                 WHERE Proyectos_Usuarios.usuario_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return res.status(500).json({ message: 'Error en la consulta SQL: ' + err.message });
    }
    if (results.length === 0) {
      console.log('No se encontraron proyectos para el usuario:', userId);
      return res.status(404).json({ message: 'No se encontraron proyectos asignados a este usuario' });
    }
    //console.log('Proyectos encontrados:', results);
    res.status(200).json(results);
  });
};

module.exports = { getProjectsByUserId, createProject, getAllProjects, getProjectById, updateProject, deleteProject, assignUsersToProject, getUsersByProjectId, getProductsByProjectId };