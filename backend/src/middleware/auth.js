const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Middleware para verificar token JWT
const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Token no válido o usuario inactivo' });
    }

    // Agregar usuario al request
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Middleware para verificar rol de administrador
const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'administrador') {
    next();
  } else {
    res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol de administrador' });
  }
};

module.exports = {
  verificarToken,
  esAdmin
};