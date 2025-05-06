const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

// Rutas públicas
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Rutas protegidas
router.get('/perfil', verificarToken, authController.perfil);

module.exports = router;