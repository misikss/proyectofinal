# Sistema de Gestión de Farmacia Nova Salud
## Descripción General
Este proyecto es un sistema completo de gestión para la botica Nova Salud, diseñado para administrar inventario, ventas, clientes, proveedores y más. El sistema está construido con una arquitectura moderna de frontend y backend separados.

## Estructura del Proyecto


## Tecnologías Utilizadas
### Frontend
- React : Biblioteca para construir interfaces de usuario
- Material-UI : Framework de componentes para un diseño moderno
- React Router : Navegación entre páginas
- Axios : Cliente HTTP para comunicación con la API
- Formik y Yup : Manejo y validación de formularios
### Backend
- Node.js : Entorno de ejecución para JavaScript
- Express : Framework web para Node.js
- Sequelize : ORM para interactuar con la base de datos
- JWT : Autenticación basada en tokens
- Swagger : Documentación de la API
## Módulos Principales
### 1. Autenticación y Usuarios
- Sistema de login/logout
- Gestión de permisos (administrador/vendedor)
- Perfil de usuario
### 2. Productos
- Catálogo completo de productos
- Gestión de stock
- Alertas de stock bajo
- Categorización de productos
- Precios de compra y venta
### 3. Ventas
- Registro de nuevas ventas
- Historial de ventas
- Detalles de venta
- Diferentes métodos de pago
### 4. Clientes
- Registro de clientes
- Historial de compras por cliente
- Información de contacto
### 5. Proveedores
- Gestión de proveedores
- Productos asociados a cada proveedor
### 6. Categorías
- Organización de productos por categorías
- Activación/desactivación de categorías
### 7. Dashboard
- Estadísticas de ventas
- Productos más vendidos
- Indicadores clave de rendimiento
## Seguridad
- Autenticación mediante JWT (JSON Web Tokens)
- Refresh tokens para mantener la sesión
- Roles y permisos diferenciados
- Protección de rutas sensibles
## API RESTful
El backend proporciona una API RESTful completa con endpoints para todas las entidades del sistema:

- Usuarios
- Productos
- Ventas
- Clientes
- Proveedores
- Categorías
## Instalación y Configuración
### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## Documentación Adicional
- La API está documentada con Swagger y accesible en /api-docs
- Cada módulo incluye validaciones de datos y manejo de errores
- El sistema implementa prácticas de seguridad recomendadas
