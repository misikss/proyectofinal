const winston = require('winston');
const { format, transports } = winston;

// Configurar formato personalizado
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Crear logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { servicio: 'nova-salud-api' },
  transports: [
    // Escribir logs de error en archivo
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Escribir todos los logs en archivo
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Si no estamos en producción, también mostrar logs en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

// Middleware para logging de solicitudes HTTP
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Cuando la respuesta termine
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      mensaje: 'Solicitud HTTP',
      metodo: req.method,
      ruta: req.originalUrl,
      estado: res.statusCode,
      duracion: `${duration}ms`,
      ip: req.ip,
      usuario: req.usuario ? req.usuario.id : 'anónimo'
    });
  });
  
  next();
};

// Función para registrar operaciones críticas
const logOperacion = (tipo, detalles, usuario) => {
  logger.info({
    mensaje: 'Operación crítica',
    tipo,
    detalles,
    usuario: usuario ? usuario.id : 'sistema',
    fecha: new Date()
  });
};

module.exports = {
  logger,
  requestLogger,
  logOperacion
};