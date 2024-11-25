// ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import Nav from "../components/Nav";
import '../assets/Productpage.css';
import { NumericFormat } from 'react-number-format'; // Importación actualizada

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio_unitario_proveedor: "",
        precio_unitario_venta: "",
        cantidad: "",
    });
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

    // Obtener el proyecto ID de la URL
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const proyectoId = params.get("projectId");

    // Cargar todos los productos del proyecto al cargar la página
    useEffect(() => {
        if (proyectoId) {
            fetchProducts(proyectoId);
        }
    }, [proyectoId]);

    // Función para obtener todos los productos del proyecto
    const fetchProducts = async (projectId) => {
        try {
            const response = await api.get(`/products/projects/${projectId}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

    // Manejar el cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Crear un nuevo producto
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post("/products", { ...form, proyectoId });
            fetchProducts(proyectoId); // Actualizar la lista de productos
            setForm({
                nombre: "",
                descripcion: "",
                precio_unitario_proveedor: "",
                precio_unitario_venta: "",
                cantidad: "",
            }); // Limpiar formulario
        } catch (error) {
            console.error("Error al crear el producto:", error);
        }
    };

    // Editar un producto existente
    const handleEditProduct = (product) => {
        setEditMode(true);
        setEditProductId(product.id);
        setForm({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio_unitario_proveedor: product.precio_unitario_proveedor,
            precio_unitario_venta: product.precio_unitario_venta,
            cantidad: product.cantidad,
        });
    };

    // Actualizar un producto existente
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editProductId}`, { ...form, proyectoId });
            fetchProducts(proyectoId); // Actualizar la lista de productos
            setEditMode(false);
            setEditProductId(null);
            setForm({
                nombre: "",
                descripcion: "",
                precio_unitario_proveedor: "",
                precio_unitario_venta: "",
                cantidad: "",
            }); // Limpiar formulario
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    // Eliminar un producto
    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            fetchProducts(proyectoId); // Actualizar la lista de productos
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Hubo un error al intentar eliminar el producto. Por favor, inténtalo nuevamente.");
        }
    };

    // Formateador para mostrar números
    const formatter = new Intl.NumberFormat('es-ES', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <>
            <Nav />
            <div
                className="productos"
                style={{ maxWidth: "60%", margin: "0 auto", textAlign: "center" }}
            >
                {/* Lista de Productos */}
                <div className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                        <h2 className="text-center text-base/7 font-semibold text-indigo-600">
                            Productos del Proyecto
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
                            Edita y elimina tus productos
                        </p>

                        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                            {products.map((product) => (
                                <div key={product.id} className="relative lg:row-span-2">
                                    <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                        <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                                            <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                                                {product.nombre}
                                            </p>
                                            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                                Descripción: {product.descripcion}
                                            </p>
                                            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                                Precio Unitario Proveedor: {formatter.format(product.precio_unitario_proveedor)}
                                            </p>
                                            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                                Precio Unitario Venta: {formatter.format(product.precio_unitario_venta)}
                                            </p>
                                            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                                Cantidad: {formatter.format(product.cantidad)}
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center justify-end gap-x-6">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                style={{ marginRight: "10px" }}
                                                type="button"
                                                className="text-sm font-semibold leading-6 text-gray-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                style={{ marginLeft: "10px" }}
                                                type="button"
                                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="formularioscrud">
                    <form onSubmit={editMode ? handleUpdateProduct : handleCreateProduct}>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                {editMode ? "Actualizar Producto" : "Crear Producto"}
                            </h2>
                            <p className="mt-2 text-lg leading-8 text-gray-600">
                                {editMode ? "Puedes actualizar tu producto si el precio del proveedor cambió o el de venta" : "Todos los campos son obligatorios"}
                            </p>
                        </div>
                        <br />
                        <div style={{ marginBottom: "10px" }}>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre del Producto"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={form.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <input
                                type="text"
                                name="descripcion"
                                placeholder="Descripción"
                                value={form.descripcion}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <NumericFormat
                                value={form.precio_unitario_proveedor}
                                onValueChange={(values) => {
                                    const { value } = values;
                                    setForm({ ...form, precio_unitario_proveedor: value });
                                }}
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowNegative={false}
                                placeholder="Precio Unitario Proveedor"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <NumericFormat
                                value={form.precio_unitario_venta}
                                onValueChange={(values) => {
                                    const { value } = values;
                                    setForm({ ...form, precio_unitario_venta: value });
                                }}
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowNegative={false}
                                placeholder="Precio Unitario Venta"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <NumericFormat
                                value={form.cantidad}
                                onValueChange={(values) => {
                                    const { value } = values;
                                    setForm({ ...form, cantidad: value });
                                }}
                                thousandSeparator="."
                                decimalSeparator=","
                                allowNegative={false}
                                placeholder="Cantidad"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                        <button
                            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            type="submit"
                            style={{ padding: "10px 20px" }}
                        >
                            {editMode ? "Actualizar Producto" : "Crear Producto"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductPage;
