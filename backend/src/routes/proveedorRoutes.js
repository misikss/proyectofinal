const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { verificarToken, esAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas públicas para usuarios autenticados
router.get('/', proveedorController.obtenerProveedores);
router.get('/:id', proveedorController.obtenerProveedor);

// Rutas que requieren rol de administrador
router.post('/', esAdmin, proveedorController.crearProveedor);
router.put('/:id', esAdmin, proveedorController.actualizarProveedor);
router.delete('/:id', esAdmin, proveedorController.eliminarProveedor);

module.exports = router;