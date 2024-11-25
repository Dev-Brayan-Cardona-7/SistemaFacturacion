import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import HomeApp from './pages/HomeApp';
import SalesPage from './pages/SalesPage';
import Reportes from './pages/Reportes';
import PrivateRoute from './components/PrivateRoute';
import User from './pages/User'; // Importa la página de registro

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/usuarios" element={<User />} /> {/* Nueva ruta para la página de registro */}

        
        {/* Rutas protegidas con PrivateRoute */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductPage />
            </PrivateRoute>
          }
        />

<Route
          path="/HomeApp"
          element={
            <PrivateRoute>
              <HomeApp />
            </PrivateRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <SalesPage />
            </PrivateRoute>
          }
        />
            <Route
          path="/Reportes"
          element={
            <PrivateRoute>
              <Reportes />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
