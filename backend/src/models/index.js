const Usuario = require('./Usuario');
const Producto = require('./Producto');
const Categoria = require('./Categoria');
const Cliente = require('./Cliente');
const Proveedor = require('./Proveedor');
const Venta = require('./Venta');
const DetalleVenta = require('./DetalleVenta');

// Definir relaciones
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });
Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });

Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor' });
Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor' });

Venta.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Cliente.hasMany(Venta, { foreignKey: 'id_cliente' });

Venta.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Usuario.hasMany(Venta, { foreignKey: 'id_usuario' });

DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta' });
Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta' });

DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto' });
Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto' });

module.exports = {
  Usuario,
  Producto,
  Categoria,
  Cliente,
  Proveedor,
  Venta,
  DetalleVenta
};