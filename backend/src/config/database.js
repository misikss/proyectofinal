require('dotenv').config();

const { Sequelize } = require('sequelize');
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'production' ? false : (msg) => logger.debug(msg),
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      } : false,
      connectTimeout: 60000
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 1000
    },
    retry: {
      max: 3,
      timeout: 60000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    logger.error('Error de conexión a la base de datos:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};