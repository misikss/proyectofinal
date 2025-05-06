const { Categoria, Producto } = require('../models');

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: { activo: true }
    });
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener una categoría por ID
const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id, {
      include: [
        {
          model: Producto,
          as: 'productos',
          where: { activo: true },
          required: false
        }
      ]
    });
    
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Crear una nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await Categoria.findOne({ where: { nombre } });
    if (categoriaExistente) {
      return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });
    }
    
    // Crear categoría
    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      activo: true
    });
    
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar una categoría
const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;
    
    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    // Verificar si el nombre ya está en uso por otra categoría
    if (nombre && nombre !== categoria.nombre) {
      const nombreExistente = await Categoria.findOne({ where: { nombre } });
      if (nombreExistente) {
        return res.status(400).json({ mensaje: 'Ya existe otra categoría con ese nombre' });
      }
    }
    
    // Actualizar categoría
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
    if (activo !== undefined) datosActualizados.activo = activo;
    
    await categoria.update(datosActualizados);
    
    // Obtener categoría actualizada
    const categoriaActualizada = await Categoria.findByPk(id);
    
    res.json(categoriaActualizada);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar una categoría (desactivar)
const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    // Verificar si hay productos activos asociados a esta categoría
    const productosAsociados = await Producto.count({
      where: { id_categoria: id, activo: true }
    });
    
    if (productosAsociados > 0) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar la categoría porque tiene productos asociados',
        productosAsociados
      });
    }
    
    // Desactivar categoría
    await categoria.update({ activo: false });
    
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};