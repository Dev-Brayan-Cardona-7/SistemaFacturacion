import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
   
        const navigate = useNavigate();
      
        const handleNavigate = () => {
          navigate('/products');
        };
  return (
    <div>
       <button onClick={handleNavigate}>Prueba</button>
      <h1>Bienvenido al Sistema de Facturación y Gestión de Stock</h1>
    </div>
  );
};

export default HomePage;
