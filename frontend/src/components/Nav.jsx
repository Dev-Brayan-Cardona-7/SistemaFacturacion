import React from "react";
import '../assets/Nav.css'; // Importa tu archivo de estilos CSS
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
    
    const navigate = useNavigate();
      
    // Función para navegar al inicio
    const NavegarInicio = () => {
        navigate('/HomeApp');
    };

        // Función para navegar al inicio
        const NavegarUsuarios = () => {
            navigate('/usuarios');
        };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        // Remueve el token de localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Redirecciona al usuario a la página de inicio de sesión
        navigate('/login');
    };

    return (
        <nav className="main-menu">
            <div>
                <div className="user-info">
                    <img
                        src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/e5a707f4-d5ac-4f30-afd8-4961ae353dbc"
                        alt="user"
                    />
                    <p>Brayan Cardona</p>
                </div>
                <ul>
                    <li className="nav-item active">
                        <a href="javascript:void(0)" onClick={NavegarInicio}>
                            <i className="fa fa-user nav-icon"></i>
                            <span className="nav-text">Inicio</span>
                        </a>
                    </li>
                    <br></br>
                    <li className="nav-item active">
                        <a href="javascript:void(0)" onClick={NavegarUsuarios}>
                            <i className="fa fa-user nav-icon"></i>
                            <span className="nav-text">usuarios</span>
                        </a>
                    </li>
                </ul>
            </div>

            <ul>
                <li className="nav-item">
                    <a href="javascript:void(0)" onClick={cerrarSesion}>
                        <i className="fa fa-right-from-bracket nav-icon"></i>
                        <span className="nav-text">Salir</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default MainMenu;
