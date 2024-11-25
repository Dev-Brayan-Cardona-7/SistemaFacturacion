import React, { useState } from 'react';
import api from '../services/api';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'cliente',
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setFotoPerfil(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('password', form.password);
    formData.append('email', form.email);
    formData.append('role', form.role);
    if (fotoPerfil) {
      formData.append('fotoPerfil', fotoPerfil);
    }

    try {
      const response = await api.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Error al registrar el usuario');
    }
  };

  return (
    <div className="register-form">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select name="role" value={form.role} onChange={handleInputChange}>
            <option value="cliente">Cliente</option>
            <option value="desarrollador">Desarrollador</option>
          </select>
        </div>
        <div>
          <label>Foto de Perfil:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
