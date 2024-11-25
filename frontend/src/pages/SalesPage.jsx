import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import Nav from "../components/Nav";
import "../assets/SalesPage.css";

const SalePage = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [productosVenta, setProductosVenta] = useState([]);
  const [form, setForm] = useState({
    productoId: "",
    cantidadVendida: "",
  });

  // Obtener el proyecto ID de la URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const proyectoId = params.get("projectId");

  // Cargar todos los productos del proyecto y las ventas del día al cargar la página
  useEffect(() => {
    if (proyectoId) {
      fetchProductos(proyectoId);
      fetchVentasDelDia(proyectoId);
    }
  }, [proyectoId]);

  // Función para obtener todos los productos del proyecto
  const fetchProductos = async (projectId) => {
    try {
      const response = await api.get(`/products/projects/${projectId}`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  // Función para obtener todas las ventas del día para el proyecto
  const fetchVentasDelDia = async (projectId) => {
    try {
      const response = await api.get(`/sales/projects/${projectId}/today`);
      let SumatotalVentas=0;
      response.data.forEach(ventas => {
        ventas.detalles.forEach(detalle => {
          SumatotalVentas += parseFloat(detalle.total)
         
          
          
        });
        //console.log(ventas);
        
        
      });
      console.log(SumatotalVentas);
      setVentas(response.data);
    } catch (error) {
      console.error("Error al obtener las ventas del día:", error);
    }
  };

  // Manejar el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  // Agregar un producto a la lista de productos para la venta
  const handleAddProduct = () => {
    if (form.productoId && form.cantidadVendida) {
      const productoSeleccionado = productos.find(
        (p) => String(p.id) === String(form.productoId)
      );

      if (productoSeleccionado) {
        setProductosVenta([
          ...productosVenta,
          {
            id: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            cantidadDisponible: productoSeleccionado.cantidad,
            cantidadVendida: form.cantidadVendida,
            precio_unitario: productoSeleccionado.precio_unitario_venta, // Agregando también el precio
          },
        ]);
        // Limpiar el formulario después de agregar el producto
        setForm({ productoId: "", cantidadVendida: "" });
      } else {
        alert("El producto seleccionado no se encontró.");
      }
    } else {
      alert(
        "Por favor, selecciona un producto y especifica la cantidad vendida."
      );
    }
  };

  // Registrar una nueva venta
  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioId = localStorage.getItem("userId"); // Obtener el ID del usuario logueado
      const ventaData = {
        proyectoId,
        usuarioId,
        productos: productosVenta.map((producto) => ({
          productoId: producto.id,
          cantidadVendida: producto.cantidadVendida,
        })),
      };
      console.log(productosVenta);

      await api.post("/sales", ventaData);
      fetchVentasDelDia(proyectoId); // Actualizar la lista de ventas del día
      setProductosVenta([]); // Limpiar la lista de productos para la venta
      alert("Venta registrada exitosamente");
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Hubo un error al registrar la venta");
    }
  };

  return (
    <>
      <Nav />
      <div
        className="ventas"
        style={{ maxWidth: "60%", margin: "0 auto", textAlign: "center" }}
      >
        {/* Formulario para Registrar Venta */}
        <div className="formularioscrudventas">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Registrar Venta
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Selecciona un producto y registra la cantidad vendida
            </p>
          </div>
          <br />
          <div style={{ marginBottom: "10px" }}>
            <select
              name="productoId"
              value={form.productoId}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            >
              <option value="">Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} (Cantidad Disponible: {producto.cantidad})
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="number"
              name="cantidadVendida"
              placeholder="Cantidad Vendida"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={form.cantidadVendida}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleAddProduct}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            style={{ padding: "10px 20px", marginBottom: "20px" }}
          >
            Agregar Producto
          </button>

          {/* Lista de productos para la venta */}
          {productosVenta.length > 0 && (
            <div className="productos-venta">
              <h3 className="text-2xl font-semibold">Productos en la Venta</h3>
              <ul>
                {productosVenta.map((producto, index) => (
                  <li key={index}>
                    {producto.nombre} - Cantidad: {producto.cantidadVendida}
                  </li>
                ))}
              </ul>
              <button
                className="block w-full rounded-md bg-green-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                onClick={handleSaleSubmit}
                style={{ padding: "10px 20px", marginTop: "20px" }}
              >
                Registrar Venta
              </button>
            </div>
          )}
        </div>

        {/* Lista de Ventas del Día */}
         {/* Lista de Ventas del Día */}
         <div className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                        <h2 className="text-center text-base/7 font-semibold text-indigo-600">
                            Ventas del Día
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
                            Listado de Ventas Realizadas Hoy
                        </p>

                        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                            {ventas.length === 0 ? (
                                <p>No se han registrado ventas hoy</p>
                            ) : (
                                ventas.map((venta) => (
                                    <div key={venta.id} className="relative lg:row-span-2">
                                        <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                            <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                                                <h3 className="text-xl font-bold text-gray-950">Venta ID: {venta.id}</h3>
                                                <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '1px 0' }}>
                                                    {venta.detalles.map((detalle, index) => (
                                                        <div key={index}>
                                                            <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                                                                Producto: {detalle.nombre_producto}
                                                            </p>
                                                            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                                                Cantidad Vendida: {detalle.cantidad_vendida}
                                                            </p>
                                                            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                                                Total: ${detalle.total}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                                    Fecha: {new Date(venta.fecha).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
      </div>
    </>
  );
};

export default SalePage;
