const { Usuario } = require('../models');

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener un usuario por ID
const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    
    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    
    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password_hash: password, // El hook beforeCreate se encargará de hashear la contraseña
      rol
    });
    
    // Excluir password_hash de la respuesta
    const { password_hash, ...usuarioSinPassword } = nuevoUsuario.toJSON();
    
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, rol, activo } = req.body;
    
    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ mensaje: 'El email ya está registrado por otro usuario' });
      }
    }
    
    // Actualizar usuario
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (apellido) datosActualizados.apellido = apellido;
    if (email) datosActualizados.email = email;
    if (password) datosActualizados.password_hash = password;
    if (rol) datosActualizados.rol = rol;
    if (activo !== undefined) datosActualizados.activo = activo;
    
    await usuario.update(datosActualizados);
    
    // Obtener usuario actualizado sin password_hash
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar un usuario (desactivar)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    // Desactivar usuario en lugar de eliminarlo
    await usuario.update({ activo: false });
    
    res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};