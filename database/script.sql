-- Crear base de datos
CREATE DATABASE IF NOT EXISTS nova_salud;
USE nova_salud;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'vendedor') NOT NULL DEFAULT 'vendedor',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_categoria INT NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,
    id_proveedor INT,
    fecha_vencimiento DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    tipo_documento ENUM('DNI', 'RUC', 'CE', 'Pasaporte') NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_cliente INT,
    id_usuario INT NOT NULL,
    metodo_pago ENUM('Efectivo', 'Tarjeta', 'Transferencia', 'Otro') NOT NULL,
    estado ENUM('Completada', 'Anulada', 'Pendiente') NOT NULL DEFAULT 'Completada',
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Tabla de detalle de ventas
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- Insertar usuarios por defecto
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES
('Admin', 'Sistema', 'admin@novasalud.com', '$2b$10$XgwZkthKXVm7Kv9KD1Ky8.1XKT.gGBNT.0WgbJoZ0TG4JV3HO2Aqy', 'administrador'),
('Vendedor', 'Principal', 'vendedor@novasalud.com', '$2b$10$XgwZkthKXVm7Kv9KD1Ky8.1XKT.gGBNT.0WgbJoZ0TG4JV3HO2Aqy', 'vendedor');

-- Insertar categorías básicas
INSERT INTO categorias (nombre, descripcion) VALUES
('Medicamentos', 'Productos farmacéuticos y medicinas'),
('Insumos Médicos', 'Material médico y de curación'),
('Suplementos', 'Vitaminas y suplementos alimenticios'),
('Higiene Personal', 'Productos de cuidado personal');

-- Trigger para actualizar stock después de una venta
DELIMITER //
CREATE TRIGGER after_detalle_venta_insert
AFTER INSERT ON detalle_ventas
FOR EACH ROW
BEGIN
  UPDATE productos 
  SET stock_actual = stock_actual - NEW.cantidad 
  WHERE id = NEW.id_producto;
END//

-- Trigger para restaurar stock después de anular una venta
CREATE TRIGGER after_venta_update
AFTER UPDATE ON ventas
FOR EACH ROW
BEGIN
  IF NEW.estado = 'Anulada' AND OLD.estado != 'Anulada' THEN
    UPDATE productos p
    JOIN detalle_ventas dv ON p.id = dv.id_producto
    WHERE dv.id_venta = NEW.id
    SET p.stock_actual = p.stock_actual + dv.cantidad;
  END IF;
END//
DELIMITER ;