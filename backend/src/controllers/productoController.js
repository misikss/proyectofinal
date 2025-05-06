const { Producto, Categoria, Proveedor, sequelize } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener un producto por ID
const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener productos por categoría
const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productos = await Producto.findAll({
      where: { 
        id_categoria: id,
        activo: true
      },
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });
    
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener productos por proveedor
const obtenerProductosPorProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productos = await Producto.findAll({
      where: { 
        id_proveedor: id,
        activo: true
      },
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });
    
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por proveedor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener productos con stock bajo
const obtenerProductosStockBajo = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: {
        activo: true,
        stock_actual: {
          [Op.lte]: sequelize.col('stock_minimo')
        }
      },
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });
    
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { 
      codigo, 
      nombre, 
      descripcion, 
      id_categoria, 
      precio_compra, 
      precio_venta, 
      stock_actual, 
      stock_minimo, 
      id_proveedor, 
      fecha_vencimiento,
      activo 
    } = req.body;
    
    // Verificar si ya existe un producto con el mismo código
    const productoExistente = await Producto.findOne({ where: { codigo } });
    if (productoExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un producto con ese código' });
    }
    
    // Verificar si la categoría existe
    const categoriaExistente = await Categoria.findByPk(id_categoria);
    if (!categoriaExistente) {
      return res.status(400).json({ mensaje: 'La categoría seleccionada no existe' });
    }
    
    // Verificar si el proveedor existe (si se proporciona)
    if (id_proveedor) {
      const proveedorExistente = await Proveedor.findByPk(id_proveedor);
      if (!proveedorExistente) {
        return res.status(400).json({ mensaje: 'El proveedor seleccionado no existe' });
      }
    }
    
    // Crear producto
    const nuevoProducto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      id_categoria,
      precio_compra,
      precio_venta,
      stock_actual: stock_actual || 0,
      stock_minimo: stock_minimo || 5,
      id_proveedor,
      fecha_vencimiento,
      activo: activo !== undefined ? activo : true
    });
    
    // Obtener producto con relaciones
    const productoCreado = await Producto.findByPk(nuevoProducto.id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });
    
    res.status(201).json(productoCreado);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      codigo, 
      nombre, 
      descripcion, 
      id_categoria, 
      precio_compra, 
      precio_venta, 
      stock_actual, 
      stock_minimo, 
      id_proveedor, 
      fecha_vencimiento,
      activo
    } = req.body;
    
    // Verificar si el producto existe
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Verificar si el código ya está en uso por otro producto
    if (codigo && codigo !== producto.codigo) {
      const codigoExistente = await Producto.findOne({ where: { codigo } });
      if (codigoExistente) {
        return res.status(400).json({ mensaje: 'Ya existe otro producto con ese código' });
      }
    }
    
    // Verificar si la categoría existe
    if (id_categoria) {
      const categoriaExistente = await Categoria.findByPk(id_categoria);
      if (!categoriaExistente) {
        return res.status(400).json({ mensaje: 'La categoría seleccionada no existe' });
      }
    }
    
    // Verificar si el proveedor existe (si se proporciona)
    if (id_proveedor) {
      const proveedorExistente = await Proveedor.findByPk(id_proveedor);
      if (!proveedorExistente) {
        return res.status(400).json({ mensaje: 'El proveedor seleccionado no existe' });
      }
    }
    
    // Actualizar producto
    const datosActualizados = {};
    if (codigo) datosActualizados.codigo = codigo;
    if (nombre) datosActualizados.nombre = nombre;
    if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
    if (id_categoria) datosActualizados.id_categoria = id_categoria;
    if (precio_compra !== undefined) datosActualizados.precio_compra = precio_compra;
    if (precio_venta !== undefined) datosActualizados.precio_venta = precio_venta;
    if (stock_actual !== undefined) datosActualizados.stock_actual = stock_actual;
    if (stock_minimo !== undefined) datosActualizados.stock_minimo = stock_minimo;
    if (id_proveedor !== undefined) datosActualizados.id_proveedor = id_proveedor;
    if (fecha_vencimiento !== undefined) datosActualizados.fecha_vencimiento = fecha_vencimiento;
    if (activo !== undefined) datosActualizados.activo = activo;
    
    await producto.update(datosActualizados);
    
    // Obtener producto actualizado con relaciones
    const productoActualizado = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });
    
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar un producto (desactivar)
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el producto existe
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Desactivar producto en lugar de eliminarlo
    await producto.update({ activo: false });
    
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Ajustar stock de un producto
const ajustarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, tipo, motivo } = req.body;
    
    // Verificar si el producto existe
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Validar cantidad
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser un número positivo' });
    }
    
    // Validar tipo de ajuste
    if (tipo !== 'entrada' && tipo !== 'salida') {
      return res.status(400).json({ mensaje: 'El tipo de ajuste debe ser "entrada" o "salida"' });
    }
    
    // Calcular nuevo stock
    let nuevoStock;
    if (tipo === 'entrada') {
      nuevoStock = producto.stock_actual + cantidad;
    } else {
      nuevoStock = producto.stock_actual - cantidad;
      
      // Validar que no quede stock negativo
      if (nuevoStock < 0) {
        return res.status(400).json({ 
          mensaje: 'No hay suficiente stock para realizar esta operación',
          stockActual: producto.stock_actual
        });
      }
    }
    
    // Actualizar stock
    await producto.update({ stock_actual: nuevoStock });
    
    // Registrar movimiento (esto podría implementarse en una tabla de movimientos)
    
    res.json({
      mensaje: `Stock ${tipo === 'entrada' ? 'aumentado' : 'reducido'} correctamente`,
      stockAnterior: producto.stock_actual,
      stockNuevo: nuevoStock,
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        codigo: producto.codigo
      }
    });
  } catch (error) {
    console.error('Error al ajustar stock:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  obtenerProductosPorCategoria,
  obtenerProductosPorProveedor,
  obtenerProductosStockBajo,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  ajustarStock
};