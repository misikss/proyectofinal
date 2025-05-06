const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  tipo_documento: {
    type: DataTypes.ENUM('DNI', 'RUC', 'CE', 'Pasaporte'),
    allowNull: false
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'clientes',
  timestamps: false,
  indexes: [
    {
      name: 'uk_documento',
      unique: true,
      fields: ['documento', 'tipo_documento']
    },
    {
      name: 'idx_nombre_cliente',
      fields: ['nombre', 'apellido']
    },
    {
      name: 'idx_documento',
      fields: ['documento']
    }
  ]
});

module.exports = Cliente;