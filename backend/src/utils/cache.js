const NodeCache = require('node-cache');

// Crear instancia de caché con tiempo de vida de 5 minutos
const cache = new NodeCache({ stdTTL: 300 });

// Middleware para cachear respuestas
const cacheMiddleware = (key, ttl = 300) => {
  return (req, res, next) => {
    // Generar clave única basada en la ruta y parámetros
    const cacheKey = `${key}_${JSON.stringify(req.params)}_${JSON.stringify(req.query)}`;
    
    // Verificar si existe en caché
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Guardar método original de res.json
    const originalJson = res.json;
    
    // Sobreescribir res.json para cachear la respuesta
    res.json = function(data) {
      // Guardar en caché
      cache.set(cacheKey, data, ttl);
      
      // Llamar al método original
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Función para invalidar caché
const invalidarCache = (key) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(k => k.startsWith(key));
  
  keysToDelete.forEach(k => cache.del(k));
};

module.exports = {
  cache,
  cacheMiddleware,
  invalidarCache
};