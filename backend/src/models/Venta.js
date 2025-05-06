const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venta = sequelize.define('Venta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'clientes',
      key: 'id'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  metodo_pago: {
    type: DataTypes.ENUM('Efectivo', 'Tarjeta', 'Transferencia', 'Otro'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Completada', 'Anulada', 'Pendiente'),
    allowNull: false,
    defaultValue: 'Completada'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  impuestos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  descuento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'ventas',
  timestamps: false,
  indexes: [
    {
      name: 'idx_fecha',
      fields: ['fecha']
    },
    {
      name: 'idx_cliente',
      fields: ['id_cliente']
    },
    {
      name: 'idx_usuario',
      fields: ['id_usuario']
    },
    {
      name: 'idx_estado',
      fields: ['estado']
    }
  ]
});

module.exports = Venta;