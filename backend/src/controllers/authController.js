// src/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Registro de usuario
const register = (req, res) => {
  const { username, password, email, role } = req.body;

  // Verificar que todos los campos estén completos
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Por favor, completa todos los campos" });
  }

  // Buscar si el usuario ya existe
  User.findByUsername(username, (err, result) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });
    if (result.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear el nuevo usuario
    User.create(
      { username, password, email, role: role || "cliente" },
      (err) => {
        if (err)
          return res.status(500).json({ message: "Error al crear el usuario" });
        res.status(201).json({ message: "Usuario registrado exitosamente" });
      }
    );
  });
};

// Login de usuario
const login = (req, res) => {
  const { username, password } = req.body;

  console.log("Datos recibidos en el servidor:", { username, password });
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, completa todos los campos" });
  }

  User.findByUsername(username, (err, result) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });
    if (result.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = result[0];
    //console.log("user:", user);

    
    //esto es para hasear alguna contraseña si necesito algo
    const hashPassword = async (password) => {
      const saltRounds = 10; // Puedes ajustar esto si necesitas más seguridad, pero 10 es una buena referencia
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log("Contraseña Hasheada:", hashedPassword);
    };

    //hashPassword("123");

    // Comparar la contraseña ingresada con la almacenada
    bcrypt.compare(password, user.contraseña, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Error en el servidor" });
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
        console.log("Contraseña incorrecta");
      }

      // Generar el token JWT
      const token = jwt.sign(
        { id: user.id, role: user.rol },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      //console.log(token);

      res.json({ message: "Inicio de sesión exitoso", token, user: { id: user.id, username: user.username, email: user.email, role: user.rol }});
    });
  });
};

module.exports = { register, login };
