// src/models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (userData, callback) => {
    // Encriptar la contraseña antes de guardar
    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) return callback(err);

      const query = `INSERT INTO Usuarios (nombre_usuario, contraseña, correo, rol) VALUES (?, ?, ?, ?)`;
      db.query(query, [userData.username, hash, userData.email, userData.role], callback);
    });
  },

  findByUsername: (username, callback) => {
    const query = `SELECT * FROM Usuarios WHERE nombre_usuario = ?`;
    db.query(query, [username], callback);
  },
};

module.exports = User;
