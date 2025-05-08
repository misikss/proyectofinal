const { sequelize } = require('../config/database');
const Venta = require('./Venta');
const Cliente = require('./Cliente');
const Producto = require('./Producto');
const Usuario = require('./Usuario');
const DetalleVenta = require('./DetalleVenta');
const Categoria = require('./Categoria');
const Proveedor = require('./Proveedor');

// Definir relaciones
Venta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
Venta.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', as: 'detalles' });

DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', as: 'detalles' });

Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' });

Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor', as: 'productos' });

module.exports = {
  sequelize,
  Venta,
  Cliente,
  Producto,
  Usuario,
  DetalleVenta,
  Categoria,
  Proveedor
};