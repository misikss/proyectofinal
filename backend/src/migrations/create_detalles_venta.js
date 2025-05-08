const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('detalles_venta', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ventas',
          key: 'id'
        }
      },
      id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'productos',
          key: 'id'
        }
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    });

    await queryInterface.addIndex('detalles_venta', ['id_venta']);
    await queryInterface.addIndex('detalles_venta', ['id_producto']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('detalles_venta');
  }
}; 