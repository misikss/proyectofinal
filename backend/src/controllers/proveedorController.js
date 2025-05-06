const { Proveedor, Producto } = require('../models');

// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener un proveedor por ID
const obtenerProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id, {
      include: [
        {
          model: Producto,
          as: 'productos',
          where: { activo: true },
          required: false
        }
      ]
    });
    
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    res.json(proveedor);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Crear un nuevo proveedor
const crearProveedor = async (req, res) => {
  try {
    const { nombre, contacto, telefono, email, direccion } = req.body;
    
    // Crear proveedor
    const nuevoProveedor = await Proveedor.create({
      nombre,
      contacto,
      telefono,
      email,
      direccion
    });
    
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar un proveedor
const actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, contacto, telefono, email, direccion } = req.body;
    
    // Verificar si el proveedor existe
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    // Actualizar proveedor
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (contacto !== undefined) datosActualizados.contacto = contacto;
    if (telefono !== undefined) datosActualizados.telefono = telefono;
    if (email !== undefined) datosActualizados.email = email;
    if (direccion !== undefined) datosActualizados.direccion = direccion;
    
    await proveedor.update(datosActualizados);
    
    // Obtener proveedor actualizado
    const proveedorActualizado = await Proveedor.findByPk(id);
    
    res.json(proveedorActualizado);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar un proveedor
const eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el proveedor existe
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    // Verificar si hay productos asociados a este proveedor
    const productosAsociados = await Producto.count({
      where: { id_proveedor: id, activo: true }
    });
    
    if (productosAsociados > 0) {
      // Actualizar productos para quitar la referencia al proveedor
      await Producto.update(
        { id_proveedor: null },
        { where: { id_proveedor: id } }
      );
    }
    
    // Eliminar proveedor
    await proveedor.destroy();
    
    res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};