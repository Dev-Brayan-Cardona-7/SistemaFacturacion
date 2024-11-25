import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  // Si no hay token, redirige a la página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si hay token, renderiza el componente hijo
  return children;
};

export default PrivateRoute;
