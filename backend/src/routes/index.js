const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const productoRoutes = require('./productoRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const clienteRoutes = require('./clienteRoutes');
const proveedorRoutes = require('./proveedorRoutes');
const ventaRoutes = require('./ventaRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/productos', productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/clientes', clienteRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/ventas', ventaRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router; 