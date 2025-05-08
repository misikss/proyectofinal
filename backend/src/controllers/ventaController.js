const { Venta, DetalleVenta, Producto, Cliente, Usuario } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    console.log('Obteniendo ventas...');
    console.log('Usuario:', req.usuario);
    
    const { desde, hasta, estado } = req.query;
    
    // Construir condiciones de búsqueda
    const where = {};
    
    if (desde && hasta) {
      where.fecha = {
        [Op.between]: [new Date(desde), new Date(hasta)]
      };
    } else if (desde) {
      where.fecha = {
        [Op.gte]: new Date(desde)
      };
    } else if (hasta) {
      where.fecha = {
        [Op.lte]: new Date(hasta)
      };
    }
    
    if (estado) {
      where.estado = estado;
    }
    
    // Si el usuario no es administrador, solo mostrar sus ventas
    if (req.usuario.rol !== 'administrador') {
      where.id_usuario = req.usuario.id;
    }
    
    console.log('Condiciones de búsqueda:', where);
    
    const ventas = await Venta.findAll({
      where,
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'apellido', 'documento', 'tipo_documento']
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ],
      order: [['fecha', 'DESC']]
    });
    
    console.log(`Se encontraron ${ventas.length} ventas`);
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      mensaje: 'Error en el servidor',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Obtener una venta por ID
const obtenerVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['id', 'codigo', 'nombre', 'descripcion']
            }
          ]
        },
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'apellido', 'documento', 'tipo_documento', 'telefono', 'email']
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });
    
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    
    // Verificar permisos: solo administradores pueden ver todas las ventas
    if (req.usuario.rol !== 'administrador' && venta.id_usuario !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver esta venta' });
    }
    
    res.json(venta);
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Crear una nueva venta
const crearVenta = async (req, res) => {
  let t;
  try {
    t = await sequelize.transaction();
    
    const { 
      id_cliente, 
      metodo_pago, 
      detalles,
      subtotal,
      impuestos,
      descuento,
      total
    } = req.body;
    
    // Validar que haya detalles
    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      if (t) await t.rollback();
      return res.status(400).json({ mensaje: 'La venta debe tener al menos un producto' });
    }
    
    // Verificar stock de productos
    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.id_producto, { transaction: t });
      
      if (!producto) {
        if (t) await t.rollback();
        return res.status(404).json({ 
          mensaje: `Producto con ID ${detalle.id_producto} no encontrado` 
        });
      }
      
      if (producto.stock_actual < detalle.cantidad) {
        if (t) await t.rollback();
        return res.status(400).json({ 
          mensaje: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock_actual}` 
        });
      }
    }
    
    // Crear venta
    const nuevaVenta = await Venta.create({
      fecha: new Date(),
      id_cliente,
      id_usuario: req.usuario.id,
      metodo_pago,
      estado: 'Completada',
      subtotal,
      impuestos,
      descuento,
      total
    }, { transaction: t });
    
    // Crear detalles de venta
    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.id_producto, { transaction: t });
      
      await DetalleVenta.create({
        id_venta: nuevaVenta.id,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal
      }, { transaction: t });
      
      // Actualizar stock
      await producto.update({
        stock_actual: producto.stock_actual - detalle.cantidad
      }, { transaction: t });
    }
    
    await t.commit();
    
    // Obtener venta completa con detalles
    const ventaCompleta = await Venta.findByPk(nuevaVenta.id, {
      include: [
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto'
            }
          ]
        },
        {
          model: Cliente,
          as: 'cliente'
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });
    
    res.status(201).json(ventaCompleta);
  } catch (error) {
    if (t) await t.rollback();
    console.error('Error al crear venta:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Anular una venta
const anularVenta = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Verificar si la venta existe
    const venta = await Venta.findByPk(id, { transaction: t });
    if (!venta) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    
    // Verificar si la venta ya está anulada
    if (venta.estado === 'Anulada') {
      await t.rollback();
      return res.status(400).json({ mensaje: 'La venta ya está anulada' });
    }
    
    // Anular venta
    await venta.update({ estado: 'Anulada' }, { transaction: t });
    
    // Restaurar stock de productos (esto también se maneja por el trigger en la base de datos)
    const detalles = await DetalleVenta.findAll({
      where: { id_venta: id },
      include: [{ model: Producto, as: 'producto' }],
      transaction: t
    });
    
    for (const detalle of detalles) {
      await detalle.producto.update({
        stock_actual: detalle.producto.stock_actual + detalle.cantidad
      }, { transaction: t });
    }
    
    await t.commit();
    
    res.json({ mensaje: 'Venta anulada correctamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error al anular venta:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Reporte de ventas diarias
const reporteDiario = async (req, res) => {
  try {
    const { fecha } = req.query;
    const fechaReporte = fecha ? new Date(fecha) : new Date();
    
    // Establecer inicio y fin del día
    const inicioDia = new Date(fechaReporte.setHours(0, 0, 0, 0));
    const finDia = new Date(fechaReporte.setHours(23, 59, 59, 999));
    
    // Obtener ventas del día
    const ventas = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [inicioDia, finDia]
        },
        estado: 'Completada'
      },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });
    
    // Calcular totales
    const totalVentas = ventas.length;
    const montoTotal = ventas.reduce((sum, venta) => sum + parseFloat(venta.total), 0);
    
    // Ventas por usuario
    const ventasPorUsuario = {};
    ventas.forEach(venta => {
      const nombreUsuario = `${venta.usuario.nombre} ${venta.usuario.apellido}`;
      if (!ventasPorUsuario[nombreUsuario]) {
        ventasPorUsuario[nombreUsuario] = {
          cantidad: 0,
          monto: 0
        };
      }
      ventasPorUsuario[nombreUsuario].cantidad += 1;
      ventasPorUsuario[nombreUsuario].monto += parseFloat(venta.total);
    });
    
    res.json({
      fecha: inicioDia,
      totalVentas,
      montoTotal,
      ventasPorUsuario
    });
  } catch (error) {
    console.error('Error al generar reporte diario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Reporte de ventas mensuales
const reporteMensual = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const fechaActual = new Date();
    
    // Establecer mes y año para el reporte
    const mesReporte = mes ? parseInt(mes) - 1 : fechaActual.getMonth();
    const anioReporte = anio ? parseInt(anio) : fechaActual.getFullYear();
    
    // Establecer inicio y fin del mes
    const inicioMes = new Date(anioReporte, mesReporte, 1);
    const finMes = new Date(anioReporte, mesReporte + 1, 0, 23, 59, 59, 999);
    
    // Obtener ventas del mes
    const ventas = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [inicioMes, finMes]
        },
        estado: 'Completada'
      }
    });
    
    // Calcular totales
    const totalVentas = ventas.length;
    const montoTotal = ventas.reduce((sum, venta) => sum + parseFloat(venta.total), 0);
    
    // Ventas por día
    const ventasPorDia = {};
    ventas.forEach(venta => {
      const fecha = new Date(venta.fecha);
      const dia = fecha.getDate();
      if (!ventasPorDia[dia]) {
        ventasPorDia[dia] = {
          cantidad: 0,
          monto: 0
        };
      }
      ventasPorDia[dia].cantidad += 1;
      ventasPorDia[dia].monto += parseFloat(venta.total);
    });
    
    res.json({
      mes: mesReporte + 1,
      anio: anioReporte,
      totalVentas,
      montoTotal,
      ventasPorDia
    });
  } catch (error) {
    console.error('Error al generar reporte mensual:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Reporte de productos más vendidos
const productosMasVendidos = async (req, res) => {
  try {
    const { desde, hasta, limite } = req.query;
    const limiteResultados = limite ? parseInt(limite) : 10;
    
    // Construir condiciones de búsqueda
    const where = {
      estado: 'Completada'
    };
    
    if (desde && hasta) {
      where.fecha = {
        [Op.between]: [new Date(desde), new Date(hasta)]
      };
    } else if (desde) {
      where.fecha = {
        [Op.gte]: new Date(desde)
      };
    } else if (hasta) {
      where.fecha = {
        [Op.lte]: new Date(hasta)
      };
    }
    
    // Consulta para obtener productos más vendidos
    const productosVendidos = await DetalleVenta.findAll({
      attributes: [
        'id_producto',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'monto_total']
      ],
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['id', 'codigo', 'nombre', 'descripcion', 'precio_venta']
        },
        {
          model: Venta,
          as: 'venta',
          attributes: [],
          where
        }
      ],
      group: ['id_producto'],
      order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
      limit: limiteResultados
    });
    
    res.json(productosVendidos);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerVentas,
  obtenerVenta,
  crearVenta,
  anularVenta,
  reporteDiario,
  reporteMensual,
  productosMasVendidos
};