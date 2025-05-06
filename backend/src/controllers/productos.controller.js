const { Producto } = require('../models');
const { Op } = require('sequelize');

exports.obtenerTodos = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoria, estado, q } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (categoria) where.id_categoria = categoria;
    if (estado) where.activo = estado === 'activo';
    if (q) {
      where = {
        ...where,
        [Op.or]: [
          { codigo: { [Op.like]: `%${q}%` } },
          { nombre: { [Op.like]: `%${q}%` } }
        ]
      };
    }

    const { count, rows } = await Producto.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos'
    });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el producto'
    });
  }
};

exports.crear = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json({
      success: true,
      data: producto,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el producto'
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await producto.update(req.body);
    res.json({
      success: true,
      data: producto,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el producto'
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await producto.update({ activo: false });
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto'
    });
  }
};

exports.actualizarStock = async (req, res) => {
  try {
    const { cantidad, tipo } = req.body;
    const producto = await Producto.findByPk(req.params.id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const nuevoStock = tipo === 'entrada' 
      ? producto.stock_actual + cantidad
      : producto.stock_actual - cantidad;

    if (nuevoStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente'
      });
    }

    await producto.update({ stock_actual: nuevoStock });
    res.json({
      success: true,
      data: producto,
      message: 'Stock actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el stock'
    });
  }
}; 