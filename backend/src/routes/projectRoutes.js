// src/routes/projectRoutes.js
const express = require('express');
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject, assignUsersToProject, getUsersByProjectId, getProjectsByUserId, getProductsByProjectId } = require('../controllers/projectController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para asignar usuarios a un proyecto (solo administradores)
router.post('/assign-users', protect, authorize('administrador'), assignUsersToProject);

// Ruta para obtener los proyectos asignados a un usuario (administradores y operarios)
router.get('/user/:userId/projects', protect, authorize('administrador', 'operario'), getProjectsByUserId);

// Ruta para obtener productos asignados a un proyecto específico
router.get('/projects/:projectId/products', protect, authorize('administrador', 'operario'), getProductsByProjectId);

// Otras rutas para proyectos
router.post('/', protect, authorize('administrador'), createProject);
router.get('/', protect, getAllProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, authorize('administrador'), updateProject);
router.delete('/:id', protect, authorize('administrador'), deleteProject);

module.exports = router;
