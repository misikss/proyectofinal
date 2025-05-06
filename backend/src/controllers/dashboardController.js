const { Venta, Cliente, Producto } = require('../models');
const { sequelize } = require('../config/database');
const { Op, fn, col, literal } = require('sequelize');

// Obtener total de ventas
const obtenerTotalVentas = async (req, res) => {
  try {
    const resultado = await Venta.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'cantidad'],
        [fn('COALESCE', fn('SUM', col('total')), 0), 'total']
      ],
      where: {
        estado: 'Completada'
      }
    });

    if (!resultado) {
      return res.json({ total: 0, cantidad: 0 });
    }

    res.json({
      total: parseFloat(resultado.getDataValue('total') || 0),
      cantidad: parseInt(resultado.getDataValue('cantidad') || 0)
    });
  } catch (error) {
    console.error('Error al obtener total de ventas:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// Obtener total de clientes
const obtenerTotalClientes = async (req, res) => {
  try {
    const total = await Cliente.count();
    res.json({ total });
  } catch (error) {
    console.error('Error al obtener total de clientes:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener total de productos
const obtenerTotalProductos = async (req, res) => {
  try {
    const total = await Producto.count();
    res.json({ total });
  } catch (error) {
    console.error('Error al obtener total de productos:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener ventas mensuales
const obtenerVentasMensuales = async (req, res) => {
  try {
    const ventasMensuales = await Venta.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('fecha'), '%Y-%m'), 'mes'],
        [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('total')), 0), 'total']
      ],
      where: {
        estado: 'Completada',
        fecha: {
          [Op.gte]: sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 6 MONTH)')
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('fecha'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('fecha'), '%Y-%m'), 'ASC']]
    });

    const meses = {
      '01': 'Enero',
      '02': 'Febrero',
      '03': 'Marzo',
      '04': 'Abril',
      '05': 'Mayo',
      '06': 'Junio',
      '07': 'Julio',
      '08': 'Agosto',
      '09': 'Septiembre',
      '10': 'Octubre',
      '11': 'Noviembre',
      '12': 'Diciembre'
    };

    const datosFormateados = ventasMensuales.map(venta => {
      const mesNumero = venta.getDataValue('mes').split('-')[1];
      return {
        mes: meses[mesNumero],
        total: parseFloat(venta.getDataValue('total') || 0)
      };
    });

    res.json(datosFormateados);
  } catch (error) {
    console.error('Error al obtener ventas mensuales:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerTotalVentas,
  obtenerTotalClientes,
  obtenerTotalProductos,
  obtenerVentasMensuales
}; 