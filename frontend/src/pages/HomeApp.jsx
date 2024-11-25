// frontend/src/pages/HomeApp.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import '../assets/homeapp.css'

const HomeApp = () => {
  const [projects, setProjects] = useState([]);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProjects = async () => {
      console.log("Usuario:", user, "Token:", token); // Verificar si el usuario y el token están presentes
      try {
        if (user && token) {
          console.log("Usuario:", user, "Token:", token); // Verificar si el usuario y el token están presentes
          // Obtener los proyectos asignados al usuario logueado
          const response = await api.get(`/projects/user/${user.id}/projects`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Proyectos recibidos:", response.data); // Verificar si hay respuesta
          setProjects(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los proyectos del usuario:", error);
      }
    };

    fetchUserProjects();
  }, [user, token]);

  const handleProductsClick = (projectId) => {
    navigate(`/products?projectId=${projectId}`);
  };
  const ventasClick = (projectId) => {
    navigate(`/sales?projectId=${projectId}`);
  };
  const ReportesClick = (projectId) => {
    navigate(`/Reportes?projectId=${projectId}`);
  };

  return (
    <>
      <Nav />
      <div style={{ maxWidth: "70%", margin: "0 auto", textAlign: "center" }}>
        <h2 className="text-center text-base/7 font-semibold text-indigo-600">
          proyectos activos
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
        Gestiona tus negocios y empresas
        </p>
        <br></br>
        <br></br>
        {projects.length === 0 ? (
          <p>No tienes proyectos asignados</p>
        ) : (
          <>
            {projects.map((project) => (
              <div key={project.id} className="relative lg:row-span-2">
                <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                  <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                    <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                      {project.nombre}
                    </p>
                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                      Descripción: {project.descripcion}
                    </p>
                
     
                    <div className="mt-6">
                    <a
                      href="#"
                      onClick={() => handleProductsClick(project.id)}
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                     Productos
                    </a>
                    <a
                      href="#"
                      onClick={() => ventasClick(project.id)}
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                     Ventas
                    </a>
                    <a
                      href="#"
                      onClick={() => ReportesClick(project.id)}
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                     Reportes
                    </a>
                  </div>
                  <br></br>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default HomeApp;
