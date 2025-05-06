const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function forceCreateAdminUser() {
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
      rol: 'administrador'
    };

    // Intentar eliminar el usuario si existe (ignorar errores)
    try {
      await connection.execute(
        'DELETE FROM usuarios WHERE email = ?',
        [adminData.email]
      );
    } catch (e) {
      console.log('No se pudo eliminar usuario existente (puede que no existiera)');
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

forceCreateAdminUser(); 