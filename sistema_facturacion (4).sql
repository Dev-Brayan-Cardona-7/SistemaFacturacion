-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-11-2024 a las 18:45:42
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_facturacion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallesventa`
--

CREATE TABLE `detallesventa` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad_vendida` int(11) NOT NULL,
  `total` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detallesventa`
--

INSERT INTO `detallesventa` (`id`, `venta_id`, `producto_id`, `cantidad_vendida`, `total`) VALUES
(35, 18, 19, 2, '80.000'),
(36, 18, 20, 1, '6.000'),
(37, 19, 19, 1, '40'),
(38, 19, 20, 1, '6'),
(39, 20, 19, 1, '40'),
(40, 21, 19, 1, '40'),
(41, 22, 19, 1, '40'),
(42, 23, 19, 1, '40'),
(43, 24, 19, 1, '40'),
(44, 25, 19, 1, '40'),
(45, 26, 19, 1, '40'),
(46, 27, 19, 1, '4000000'),
(47, 28, 19, 2, '8000000'),
(48, 29, 19, 2, '8000000'),
(49, 30, 19, 4, '16000000'),
(50, 31, 19, 1, '40000'),
(51, 32, 19, 8, '320000'),
(52, 32, 20, 3, '18'),
(53, 33, 19, 1, '40000'),
(54, 33, 19, 2, '80000'),
(55, 33, 20, 2, '12'),
(56, 34, 21, 2, '10000'),
(57, 34, 23, 6, '30000'),
(58, 34, 24, 3, '24000'),
(59, 35, 24, 3, '24000'),
(60, 35, 21, 15, '75000'),
(61, 36, 22, 4, '32000'),
(62, 36, 23, 3, '15000'),
(63, 36, 24, 1, '8000'),
(64, 37, 21, 2, '10000'),
(65, 37, 23, 2, '10000'),
(66, 37, 22, 1, '8000'),
(67, 38, 22, 2, '16000'),
(68, 39, 21, 1, '5000'),
(69, 39, 24, 2, '16000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_unitario_proveedor` varchar(13) NOT NULL,
  `precio_unitario_venta` varchar(13) NOT NULL,
  `proveedor_id` int(11) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio_unitario_proveedor`, `precio_unitario_venta`, `proveedor_id`, `creado_en`, `actualizado_en`) VALUES
(19, 'Aceite Yamalube', 'Aceite para moto ', '20000.00', '40000.00', NULL, '2024-10-30 23:38:00', '2024-10-31 00:17:04'),
(20, 'Martillo Hierro', 'Martillo de hierro marca china', '3.000', '6.000', NULL, '2024-10-30 23:39:01', '2024-10-30 23:39:01'),
(21, 'Arroz De Arequipe', 'Arroz con leche de arequipe', '3000.00', '5000.00', NULL, '2024-11-07 02:38:42', '2024-11-07 02:38:42'),
(22, 'Arroz grande de arequipe ', 'Rico Arroz ', '5000.00', '8000.00', NULL, '2024-11-07 02:40:31', '2024-11-07 02:40:31'),
(23, 'Arroz pequeño tradicional', 'rico arroz', '3000.00', '5000.00', NULL, '2024-11-07 02:41:12', '2024-11-07 02:41:12'),
(24, 'Arroz grande tradicional', 'rico arroz', '5000.00', '8000.00', NULL, '2024-11-07 02:41:46', '2024-11-07 02:41:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productosproyectos`
--

CREATE TABLE `productosproyectos` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productosproyectos`
--

INSERT INTO `productosproyectos` (`id`, `proyecto_id`, `producto_id`, `cantidad`) VALUES
(11, 2, 19, 19),
(12, 2, 20, 33),
(13, 3, 21, 30),
(14, 3, 22, 33),
(15, 3, 23, 19),
(16, 3, 24, 51);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `persona_contacto` varchar(100) DEFAULT NULL,
  `teléfono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `dirección` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('en progreso','completado','cancelado') DEFAULT 'en progreso',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id`, `nombre`, `cliente_id`, `descripcion`, `fecha_inicio`, `fecha_fin`, `estado`, `creado_en`, `actualizado_en`) VALUES
(2, 'Ferreteria Caicedo Villatina', 1, 'su aliado confiable en la construcción y el mantenimiento del hogar. Ubicados en el corazón de la ciudad, ofrecemos una amplia gama de productos y servicios para satisfacer las necesidades de contratistas, profesionales y aficionados al bricolaje.', '2024-10-29', '2024-10-31', 'en progreso', '2024-10-30 03:19:37', '2024-10-30 03:19:37'),
(3, 'Arroz con leche guerro', NULL, 'Arroces con leche de todos los sabores', '2024-11-06', '2024-12-18', 'en progreso', '2024-11-07 02:31:15', '2024-11-07 02:31:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos_usuarios`
--

CREATE TABLE `proyectos_usuarios` (
  `proyecto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos_usuarios`
--

INSERT INTO `proyectos_usuarios` (`proyecto_id`, `usuario_id`) VALUES
(2, 1),
(3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `rol` enum('administrador','operario','cliente','desarrollador') NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `foto_perfil` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `contraseña`, `correo`, `rol`, `creado_en`, `actualizado_en`, `foto_perfil`, `estado`) VALUES
(1, 'usuario1', '$2a$10$N3C885CTZdV/g/oRpcfWy.D8zw8P/AiS8MSWiLtiiUHphOqzpSaYe', 'usuario1@correo.com', 'administrador', '2024-10-15 02:48:34', '2024-11-11 21:13:07', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `usuario_id`, `proyecto_id`, `fecha`) VALUES
(18, 1, 2, '2024-10-30 18:39:22'),
(19, 1, 2, '2024-10-30 18:42:45'),
(20, 1, 2, '2024-10-30 18:43:10'),
(21, 1, 2, '2024-10-30 18:44:09'),
(22, 1, 2, '2024-10-30 18:45:51'),
(23, 1, 2, '2024-10-30 18:46:44'),
(24, 1, 2, '2024-10-30 18:48:21'),
(25, 1, 2, '2024-10-30 18:49:35'),
(26, 1, 2, '2024-10-30 18:51:48'),
(27, 1, 2, '2024-10-30 18:52:30'),
(28, 1, 2, '2024-10-30 18:53:18'),
(29, 1, 2, '2024-10-30 18:54:08'),
(30, 1, 2, '2024-10-30 18:55:15'),
(31, 1, 2, '2024-11-05 22:55:21'),
(32, 1, 2, '2024-11-05 22:57:59'),
(33, 1, 2, '2024-11-06 19:10:07'),
(34, 1, 3, '2024-11-06 21:42:26'),
(35, 1, 3, '2024-11-07 19:49:08'),
(36, 1, 3, '2024-11-11 10:24:21'),
(37, 1, 3, '2024-11-11 12:14:30'),
(38, 1, 3, '2024-11-11 16:15:07'),
(39, 1, 3, '2024-11-11 16:20:36');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detallesventa`
--
ALTER TABLE `detallesventa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedor_id` (`proveedor_id`);

--
-- Indices de la tabla `productosproyectos`
--
ALTER TABLE `productosproyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indices de la tabla `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  ADD PRIMARY KEY (`proyecto_id`,`usuario_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `proyecto_id` (`proyecto_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detallesventa`
--
ALTER TABLE `detallesventa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `productosproyectos`
--
ALTER TABLE `productosproyectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detallesventa`
--
ALTER TABLE `detallesventa`
  ADD CONSTRAINT `detallesventa_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`),
  ADD CONSTRAINT `detallesventa_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`);

--
-- Filtros para la tabla `productosproyectos`
--
ALTER TABLE `productosproyectos`
  ADD CONSTRAINT `productosproyectos_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `productosproyectos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  ADD CONSTRAINT `proyectos_usuarios_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proyectos_usuarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
