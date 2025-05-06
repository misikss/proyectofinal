const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'id'
    }
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precio_venta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'proveedores',
      key: 'id'
    }
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'productos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  indexes: [
    {
      name: 'idx_codigo',
      unique: true,
      fields: ['codigo']
    },
    {
      name: 'idx_nombre_producto',
      fields: ['nombre']
    },
    {
      name: 'idx_categoria',
      fields: ['id_categoria']
    },
    {
      name: 'idx_proveedor',
      fields: ['id_proveedor']
    },
    {
      name: 'idx_stock_bajo',
      fields: ['stock_actual', 'stock_minimo']
    },
    {
      name: 'idx_vencimiento',
      fields: ['fecha_vencimiento']
    }
  ]
});

module.exports = Producto;