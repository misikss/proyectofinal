const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Datos del administrador
    const adminData = {
      nombre: 'Administrador',
      apellido: 'Sistema',
      email: 'admin@novasalud.com',
      password_hash: await bcrypt.hash('Admin123!', 10),
      rol: 'ADMIN'
    };

    // Verificar si el usuario ya existe
    const [existingUser] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [adminData.email]
    );

    if (existingUser.length > 0) {
      console.log('El usuario administrador ya existe');
      await connection.end();
      return;
    }

    // Insertar el usuario administrador
    await connection.execute(
      'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [adminData.nombre, adminData.apellido, adminData.email, adminData.password_hash, adminData.rol]
    );

    console.log('Usuario administrador creado exitosamente');
    await connection.end();
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  }
}

createAdminUser(); 