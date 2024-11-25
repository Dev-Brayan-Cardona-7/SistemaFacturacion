import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import Nav from "../components/Nav";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const ReportPage = () => {
    const [ventas, setVentas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [expandedRowIds, setExpandedRowIds] = useState({}); // Estado para las filas expandidas

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const proyectoId = params.get("projectId");
    const chartRef = useRef(null);

    // Función para obtener el reporte de ventas en un rango de fechas
    const fetchVentasPorRango = async () => {
        if (!fechaInicio || !fechaFin) {
            alert("Por favor, selecciona ambas fechas de inicio y fin");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/sales/projects/${proyectoId}/reports`, {
                params: { fechaInicio, fechaFin },
            });
            setVentas(response.data);
        } catch (error) {
            console.error("Error al obtener el reporte de ventas:", error);
            setError("Hubo un error al obtener el reporte de ventas. Por favor intenta de nuevo.");
        }
        setLoading(false);
    };

    // Calcular el resumen total de ventas y productos vendidos
    const getResumen = () => {
        let totalVentas = 0;
        let totalProductosVendidos = 0;

        ventas.forEach((venta) => {
            venta.detalles.forEach((detalle) => {
                totalVentas += parseFloat(detalle.total);
                totalProductosVendidos += parseInt(detalle.cantidad_vendida);
            });
        });

        return { totalVentas, totalProductosVendidos };
    };

    const { totalVentas, totalProductosVendidos } = getResumen();

    // Configurar la gráfica de barras para mostrar el total de ventas por día
    useEffect(() => {
        if (ventas.length > 0) {
            // Agrupar las ventas por fecha y calcular el total por día
            const ventasPorDia = ventas.reduce((acumulador, venta) => {
                const fecha = new Date(venta.fecha_dia).toLocaleDateString("es-CO");
                const totalVenta = venta.detalles.reduce(
                    (sum, detalle) => sum + parseFloat(detalle.total),
                    0
                );

                if (!acumulador[fecha]) {
                    acumulador[fecha] = totalVenta;
                } else {
                    acumulador[fecha] += totalVenta;
                }

                return acumulador;
            }, {});

            // Convertir las ventas agrupadas en un array de datos para la gráfica
            const data = Object.keys(ventasPorDia).map((fecha) => ({
                fecha,
                total: ventasPorDia[fecha],
            }));

            // Configurar la gráfica
            let chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.paddingRight = 20;
            chart.data = data;

            // Eje X (Fechas)
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "fecha";
            categoryAxis.title.text = "Fecha de Venta";
            categoryAxis.renderer.labels.template.rotation = -45;

            // Eje Y (Total Vendido)
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "Total Vendido ($)";

            // Serie de datos
            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "total";
            series.dataFields.categoryX = "fecha";
            series.name = "Total Vendido";
            series.columns.template.tooltipText = "{categoryX}: [bold]{valueY.formatNumber('#,###.##')}[/]";
            series.columns.template.fillOpacity = 0.8;

            let columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;

            chartRef.current = chart;

            return () => {
                chart.dispose();
            };
        }
    }, [ventas]);

    // Función para expandir/contraer los detalles de una venta específica
    const toggleDetalles = (id) => {
        setExpandedRowIds((prevExpandedRowIds) => ({
            ...prevExpandedRowIds,
            [id]: !prevExpandedRowIds[id],
        }));
    };

    return (
        <>
            <Nav />
            <div className="reportes" style={{ maxWidth: "80%", margin: "0 auto", textAlign: "center" }}>
                <div className="formularioscrudreportes">
                    <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Reporte de Ventas por Rango de Fechas
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Selecciona un rango de fechas para ver el reporte de ventas
                    </p>

                    {/* Selección de rango de fechas */}
                    <div className="fechas-seleccion">
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="input-fecha"
                            required
                        />
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="input-fecha"
                            required
                        />
                        <button
                            onClick={fetchVentasPorRango}
                            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            style={{ padding: "10px 20px", marginTop: "20px" }}
                        >
                            Generar Reporte
                        </button>
                    </div>
                </div>

                {/* Mostrar carga o error */}
                {loading && <p>Cargando reporte...</p>}
                {error && <p className="error">{error}</p>}

                {/* Mostrar resumen de ventas */}
                {ventas.length > 0 && (
                    <div className="resumen-ventas mt-10">
                        <h3 className="text-2xl font-semibold">Resumen de Ventas</h3>
                        <p>Total de Ventas: {totalVentas.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                        <p>Total de Productos Vendidos: {totalProductosVendidos}</p>
                    </div>
                )}

                {/* Gráfica de barras */}
                <div id="chartdiv" style={{ width: "100%", height: "500px", marginTop: "30px" }}></div>

                {/* Mostrar reporte de ventas en una tabla */}
                <div className="reporte-ventas mt-10">
                    {ventas.length === 0 && !loading && (
                        <p>No se han registrado ventas en el rango seleccionado</p>
                    )}
                    {ventas.length > 0 && (
                        <table className="tabla-reportes" style={{ width: "100%", marginTop: "20px", textAlign: "left" }}>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Total Vendido (COP)</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map((venta) => (
                                    <React.Fragment key={venta.id}>
                                        <tr>
                                            <td>{new Date(venta.fecha_dia).toLocaleDateString()}</td>
                                            <td>{parseFloat(venta.total_vendido.replace(/[^\d.,]/g, '').replace(',', '.')).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                                            <td>
                                                <button
                                                    className="btn-detalles"
                                                    onClick={() => toggleDetalles(venta.id)}
                                                    style={{ padding: "10px 20px", backgroundColor: "#1e3a8a", color: "#fff", border: "none", borderRadius: "5px" }}
                                                >
                                                    {expandedRowIds[venta.id] ? "Ocultar Detalles" : "Ver Detalles"}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRowIds[venta.id] && (
                                            <tr>
                                                <td colSpan="3">
                                                    <div className="venta-detalles" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                        {venta.detalles.map((detalle, index) => (
                                                            <div key={index} className="detalle-producto">
                                                                <p><strong>Producto:</strong> {detalle.nombre_producto}, <strong>Cantidad:</strong> {detalle.cantidad_vendida}, <strong>Total:</strong> {parseFloat(detalle.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReportPage;
