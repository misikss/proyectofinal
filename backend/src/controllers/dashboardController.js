const { Venta, Cliente, Producto, DetalleVenta } = require('../models');
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

// Obtener productos con stock bajo
const obtenerProductosStockBajo = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: {
        stock_actual: {
          [Op.lte]: col('stock_minimo')
        }
      },
      order: [['stock_actual', 'ASC']]
    });

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener productos más vendidos
const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    
    // Verificar si la tabla existe
    const tableExists = await sequelize.getQueryInterface().showAllTables()
      .then(tables => tables.includes('detalle_ventas'));
    
    if (!tableExists) {
      console.log('La tabla detalle_ventas no existe');
      return res.json([]);
    }
    
    const productosMasVendidos = await DetalleVenta.findAll({
      attributes: [
        'id_producto',
        [fn('SUM', col('cantidad')), 'cantidad_vendida'],
        [fn('SUM', col('subtotal')), 'monto_total']
      ],
      include: [{
        model: Producto,
        attributes: ['nombre']
      }],
      group: ['id_producto', 'Producto.id', 'Producto.nombre'],
      order: [[fn('SUM', col('cantidad')), 'DESC']],
      limit: limite
    });

    const resultado = productosMasVendidos.map(detalle => ({
      id: detalle.id_producto,
      nombre: detalle.Producto.nombre,
      cantidad_vendida: parseInt(detalle.getDataValue('cantidad_vendida')),
      monto_total: parseFloat(detalle.getDataValue('monto_total'))
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    console.error('Detalles del error:', error);
    // En caso de error, devolver un array vacío en lugar de un error 500
    res.json([]);
  }
};

module.exports = {
  obtenerTotalVentas,
  obtenerTotalClientes,
  obtenerTotalProductos,
  obtenerVentasMensuales,
  obtenerProductosStockBajo,
  obtenerProductosMasVendidos
}; 