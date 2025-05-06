// Middleware para paginación
const paginacion = (req, res, next) => {
  // Obtener parámetros de paginación
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = parseInt(req.query.limite) || 10;
  
  // Calcular offset
  const offset = (pagina - 1) * limite;
  
  // Agregar parámetros al request
  req.paginacion = {
    limite,
    offset,
    pagina
  };
  
  next();
};

// Función para formatear respuesta paginada
const respuestaPaginada = (data, total, req) => {
  const { limite, pagina } = req.paginacion;
  const totalPaginas = Math.ceil(total / limite);
  
  return {
    data,
    meta: {
      pagina_actual: pagina,
      total_paginas: totalPaginas,
      total_registros: total,
      registros_por_pagina: limite
    },
    links: {
      primera: pagina > 1 ? `${req.baseUrl}?pagina=1&limite=${limite}` : null,
      anterior: pagina > 1 ? `${req.baseUrl}?pagina=${pagina - 1}&limite=${limite}` : null,
      siguiente: pagina < totalPaginas ? `${req.baseUrl}?pagina=${pagina + 1}&limite=${limite}` : null,
      ultima: pagina < totalPaginas ? `${req.baseUrl}?pagina=${totalPaginas}&limite=${limite}` : null
    }
  };
};

module.exports = {
  paginacion,
  respuestaPaginada
};