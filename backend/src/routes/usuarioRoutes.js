const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticateToken } = require('../middleware/auth');

// Rutas protegidas - requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// Obtener un usuario por ID
router.get('/:id', usuarioController.obtenerUsuario);

// Crear un nuevo usuario
router.post('/', usuarioController.crearUsuario);

// Actualizar usuario
router.put('/:id', usuarioController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router; 