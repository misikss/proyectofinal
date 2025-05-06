const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING(100),
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
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'proveedores',
  timestamps: false,
  indexes: [
    {
      name: 'idx_nombre_proveedor',
      fields: ['nombre']
    }
  ]
});

module.exports = Proveedor;