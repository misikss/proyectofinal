const { Cliente, Venta } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener un cliente por ID
const obtenerCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [
        {
          model: Venta,
          as: 'ventas',
          required: false
        }
      ]
    });
    
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Buscar clientes por término
const buscarClientes = async (req, res) => {
  try {
    const { termino } = req.params;
    
    const clientes = await Cliente.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${termino}%` } },
          { apellido: { [Op.like]: `%${termino}%` } },
          { documento: { [Op.like]: `%${termino}%` } }
        ]
      }
    });
    
    res.json(clientes);
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const { 
      nombre, 
      apellido, 
      documento, 
      tipo_documento, 
      direccion, 
      telefono, 
      email 
    } = req.body;
    
    // Verificar si ya existe un cliente con el mismo documento
    const clienteExistente = await Cliente.findOne({ 
      where: { 
        documento,
        tipo_documento
      } 
    });
    
    if (clienteExistente) {
      return res.status(400).json({ 
        mensaje: `Ya existe un cliente con ese ${tipo_documento}` 
      });
    }
    
    // Crear cliente
    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      documento,
      tipo_documento,
      direccion,
      telefono,
      email
    });
    
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar un cliente
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      apellido, 
      documento, 
      tipo_documento, 
      direccion, 
      telefono, 
      email 
    } = req.body;
    
    // Verificar si el cliente existe
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Verificar si el documento ya está en uso por otro cliente
    if (documento && tipo_documento && 
        (documento !== cliente.documento || tipo_documento !== cliente.tipo_documento)) {
      const documentoExistente = await Cliente.findOne({ 
        where: { 
          documento,
          tipo_documento,
          id: { [Op.ne]: id }
        } 
      });
      
      if (documentoExistente) {
        return res.status(400).json({ 
          mensaje: `Ya existe otro cliente con ese ${tipo_documento}` 
        });
      }
    }
    
    // Actualizar cliente
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (apellido) datosActualizados.apellido = apellido;
    if (documento) datosActualizados.documento = documento;
    if (tipo_documento) datosActualizados.tipo_documento = tipo_documento;
    if (direccion !== undefined) datosActualizados.direccion = direccion;
    if (telefono !== undefined) datosActualizados.telefono = telefono;
    if (email !== undefined) datosActualizados.email = email;
    
    await cliente.update(datosActualizados);
    
    // Obtener cliente actualizado
    const clienteActualizado = await Cliente.findByPk(id);
    
    res.json(clienteActualizado);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el cliente existe
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Verificar si hay ventas asociadas a este cliente
    const ventasAsociadas = await Venta.count({
      where: { id_cliente: id }
    });
    
    if (ventasAsociadas > 0) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar el cliente porque tiene ventas asociadas',
        ventasAsociadas
      });
    }
    
    // Eliminar cliente
    await cliente.destroy();
    
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerClientes,
  obtenerCliente,
  buscarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};