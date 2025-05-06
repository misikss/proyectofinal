const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verificarToken, esAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas públicas para usuarios autenticados
router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProducto);
router.get('/categoria/:id', productoController.obtenerProductosPorCategoria);
router.get('/proveedor/:id', productoController.obtenerProductosPorProveedor);
router.get('/stock-bajo', productoController.obtenerProductosStockBajo);

// Rutas que requieren rol de administrador
router.post('/', esAdmin, productoController.crearProducto);
router.put('/:id', esAdmin, productoController.actualizarProducto);
router.delete('/:id', esAdmin, productoController.eliminarProducto);
router.post('/:id/ajustar-stock', esAdmin, productoController.ajustarStock);

module.exports = router;