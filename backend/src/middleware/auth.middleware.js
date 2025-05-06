const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

exports.esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requieren permisos de administrador'
    });
  }
  next();
};

exports.esVendedor = (req, res, next) => {
  if (req.usuario.rol !== 'vendedor' && req.usuario.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requieren permisos de vendedor'
    });
  }
  next();
}; 