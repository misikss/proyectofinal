const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
  try {
    console.log('[Auth] Verificando token...');
    console.log('[Auth] Headers:', req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('[Auth] No se encontró el header de autorización');
      return res.status(401).json({ mensaje: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('[Auth] Token no encontrado en el header');
      return res.status(401).json({ mensaje: 'Token no encontrado' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;
      console.log('[Auth] Token verificado correctamente para usuario:', decoded.id);
      next();
    } catch (error) {
      console.log('[Auth] Error al verificar token:', error.message);
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
  } catch (error) {
    console.error('[Auth] Error en middleware de autenticación:', error);
    res.status(500).json({ mensaje: 'Error en la autenticación' });
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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  verificarToken,
  esAdmin,
  authenticateToken
};