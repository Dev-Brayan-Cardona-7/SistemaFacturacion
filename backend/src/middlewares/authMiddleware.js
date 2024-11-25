// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Verificar si el usuario está autenticado
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'No autorizado, token no válido' });
    }
  } else {
    res.status(401).json({ message: 'No autorizado, no se proporcionó un token' });
  }
};

// Verificar si el usuario tiene el rol necesario
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};

module.exports = { protect, authorize };
