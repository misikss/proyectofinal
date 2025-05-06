const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAdminUser() {
  try {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Consultar si existe el usuario
    const [users] = await connection.execute(
      'SELECT id, nombre, apellido, email, rol FROM usuarios WHERE email = ?',
      ['admin@novasalud.com']
    );

    if (users.length > 0) {
      console.log('Usuario encontrado:');
      console.log(users[0]);
    } else {
      console.log('No se encontró el usuario administrador');
    }

    // Mostrar todos los usuarios
    console.log('\nLista de todos los usuarios:');
    const [allUsers] = await connection.execute('SELECT id, nombre, apellido, email, rol FROM usuarios');
    console.log(allUsers);

    await connection.end();
  } catch (error) {
    console.error('Error al verificar usuario:', error);
  }
}

checkAdminUser(); 