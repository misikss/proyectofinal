const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verificarToken, esAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas públicas para usuarios autenticados
router.get('/', categoriaController.obtenerCategorias);
router.get('/:id', categoriaController.obtenerCategoria);

// Rutas que requieren rol de administrador
router.post('/', esAdmin, categoriaController.crearCategoria);
router.put('/:id', esAdmin, categoriaController.actualizarCategoria);
router.delete('/:id', esAdmin, categoriaController.eliminarCategoria);

module.exports = router;