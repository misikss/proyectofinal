const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// Ruta de login
router.post('/login', authController.login);

// Ruta para verificar token
router.get('/verificar', verificarToken, authController.verificarToken);

module.exports = router; 