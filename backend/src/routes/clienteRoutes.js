const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas para todos los usuarios autenticados
router.get('/', clienteController.obtenerClientes);
router.get('/:id', clienteController.obtenerCliente);
router.post('/', clienteController.crearCliente);
router.put('/:id', clienteController.actualizarCliente);
router.delete('/:id', clienteController.eliminarCliente);
router.get('/buscar/:termino', clienteController.buscarClientes);

module.exports = router;