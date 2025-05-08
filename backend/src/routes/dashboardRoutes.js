const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verificarToken } = require('../middleware/auth');

// Middleware para logging
router.use((req, res, next) => {
  console.log(`[Dashboard] ${req.method} ${req.originalUrl}`);
  next();
});

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas del dashboard
router.get('/total', dashboardController.obtenerTotalVentas);
router.get('/clientes', dashboardController.obtenerTotalClientes);
router.get('/productos', dashboardController.obtenerTotalProductos);
router.get('/mensuales', dashboardController.obtenerVentasMensuales);
router.get('/productos/stock-bajo', dashboardController.obtenerProductosStockBajo);
router.get('/productos-mas-vendidos', dashboardController.obtenerProductosMasVendidos);

module.exports = router; 