const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Verificar si ya existe el usuario admin
    const existingAdmin = await Usuario.findOne({
      where: { email: 'admin@novasalud.com' }
    });

    if (existingAdmin) {
      console.log('El usuario administrador ya existe');
      process.exit(0);
    }

    // Crear el usuario administrador
    const adminUser = await Usuario.create({
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@novasalud.com',
      password_hash: await bcrypt.hash('Admin123!', 10),
      rol: 'administrador',
      activo: true
    });

    console.log('Usuario administrador creado exitosamente:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
    process.exit(1);
  }
}

createAdminUser(); 