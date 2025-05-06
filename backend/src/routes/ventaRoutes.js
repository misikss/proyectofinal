const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { verificarToken, esAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas para todos los usuarios autenticados
router.get('/', ventaController.obtenerVentas);
router.get('/:id', ventaController.obtenerVenta);
router.post('/', ventaController.crearVenta);

// Rutas que requieren rol de administrador
router.put('/:id/anular', esAdmin, ventaController.anularVenta);
router.get('/reportes/diario', esAdmin, ventaController.reporteDiario);
router.get('/reportes/mensual', esAdmin, ventaController.reporteMensual);
router.get('/reportes/productos-mas-vendidos', esAdmin, ventaController.productosMasVendidos);

module.exports = router;