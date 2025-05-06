const Joi = require('joi');

// Esquema de validación para crear venta
const esquemaCrearVenta = Joi.object({
  id_cliente: Joi.number().required().messages({
    'number.base': 'El ID del cliente debe ser un número',
    'any.required': 'El ID del cliente es obligatorio'
  }),
  metodo_pago: Joi.string().required().messages({
    'string.base': 'El método de pago debe ser texto',
    'any.required': 'El método de pago es obligatorio'
  }),
  detalles: Joi.array().items(
    Joi.object({
      id_producto: Joi.number().required(),
      cantidad: Joi.number().integer().min(1).required(),
      precio_unitario: Joi.number().min(0).required(),
      subtotal: Joi.number().min(0).required()
    })
  ).min(1).required().messages({
    'array.min': 'Debe incluir al menos un producto',
    'any.required': 'Los detalles de la venta son obligatorios'
  }),
  subtotal: Joi.number().min(0).required(),
  impuestos: Joi.number().min(0).required(),
  descuento: Joi.number().min(0).required(),
  total: Joi.number().min(0).required()
});

// Middleware de validación
const validarCrearVenta = (req, res, next) => {
  const { error } = esquemaCrearVenta.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errores = error.details.map(err => ({
      campo: err.path.join('.'),
      mensaje: err.message
    }));
    
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores
    });
  }
  
  next();
};

module.exports = {
  validarCrearVenta
  // Aquí puedes agregar más validadores para otras rutas
};