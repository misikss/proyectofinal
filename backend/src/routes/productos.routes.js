const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { verificarToken, esVendedor } = require('../middleware/auth.middleware');

// Middleware para todas las rutas
router.use(verificarToken);

// Rutas públicas (requieren autenticación pero no rol específico)
router.get('/', productosController.obtenerTodos);
router.get('/:id', productosController.obtenerPorId);

// Rutas que requieren rol de vendedor
router.use(esVendedor);
router.post('/', productosController.crear);
router.put('/:id', productosController.actualizar);
router.delete('/:id', productosController.eliminar);
router.patch('/:id/stock', productosController.actualizarStock);

module.exports = router; 