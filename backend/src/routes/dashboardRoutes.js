const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas del dashboard
router.get('/total', dashboardController.obtenerTotalVentas);
router.get('/clientes', dashboardController.obtenerTotalClientes);
router.get('/productos', dashboardController.obtenerTotalProductos);
router.get('/mensuales', dashboardController.obtenerVentasMensuales);

module.exports = router; 