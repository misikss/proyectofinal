const Usuario = require('./Usuario');
const Producto = require('./Producto');
const Categoria = require('./Categoria');
const Cliente = require('./Cliente');
const Proveedor = require('./Proveedor');
const Venta = require('./Venta');
const DetalleVenta = require('./DetalleVenta');

// Definir relaciones
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' });

Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor', as: 'productos' });

Venta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
Cliente.hasMany(Venta, { foreignKey: 'id_cliente', as: 'ventas' });

Venta.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasMany(Venta, { foreignKey: 'id_usuario', as: 'ventas' });

Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', as: 'detalles' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });

DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', as: 'detalles_venta' });

module.exports = {
  Usuario,
  Producto,
  Categoria,
  Cliente,
  Proveedor,
  Venta,
  DetalleVenta
};