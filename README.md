# Nova Salud - Sistema de Gestión de Farmacia

## Descripción del Proyecto
Nova Salud es un sistema integral de gestión para farmacias que permite administrar el inventario, ventas, clientes y proveedores de manera eficiente. El sistema está diseñado para optimizar las operaciones diarias de una farmacia, incluyendo el control de stock, seguimiento de ventas y gestión de usuarios con diferentes niveles de acceso.

## Arquitectura del Sistema

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│    Frontend     │     │   Backend    │     │  Database   │
│    (React)      │────▶│   (Node.js)  │────▶│   (MySQL)   │
└─────────────────┘     └──────────────┘     └─────────────┘
       ▲                       ▲                    ▲
       │                       │                    │
       │                       │                    │
┌──────┴──────────────────────┴────────────────────┴───────┐
│                    Características                        │
│ • Autenticación JWT                                      │
│ • API RESTful                                            │
│ • Arquitectura MVC                                       │
│ • Gestión de Estado Centralizado                         │
└──────────────────────────────────────────────────────────┘
```

## Tecnologías Utilizadas

### Frontend
- React 18.2.0
- Material-UI 5.x
- React Router 6.x
- Axios 1.x
- Recharts 2.x
- Vite 4.x

### Backend
- Node.js 18.x
- Express 4.x
- MySQL 8.0
- Sequelize 6.x
- JWT 9.x
- Winston 3.x
- Bcrypt 5.x

## Requisitos Previos
- Node.js 18.0.0 o superior
- MySQL 8.0 o superior
- npm 9.x o superior
- Git

## Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repositorio>
cd nova-salud
```

### 2. Configuración de la Base de Datos
1. Crear una base de datos MySQL:
```sql
CREATE DATABASE nova_salud;
```

2. Ejecutar el script de inicialización:
```bash
mysql -u root -p nova_salud < database/script.sql
```

### 3. Configuración del Backend
1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Crear archivo `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=nova_salud
JWT_SECRET=novasalud123456
JWT_EXPIRES_IN=24h
```

### 4. Configuración del Frontend
```bash
cd ../frontend
npm install
```

## Iniciar el Proyecto

### Ambiente de Desarrollo
1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. Iniciar el frontend:
```bash
cd frontend
npm run dev
```

### Ambiente de Producción
1. Construir el frontend:
```bash
cd frontend
npm run build
```

2. Iniciar el backend en producción:
```bash
cd backend
npm start
```

## Funcionalidades Principales

### 1. Gestión de Productos
- Inventario en tiempo real
- Control de stock mínimo
- Registro de fechas de vencimiento
- Categorización de productos

### 2. Sistema de Ventas
- Registro de ventas
- Facturación
- Control de pagos
- Historial de transacciones

### 3. Gestión de Usuarios
- Roles: Administrador y Vendedor
- Permisos diferenciados
- Registro de actividades

### 4. Reportes y Estadísticas
- Dashboard con métricas clave
- Reportes de ventas
- Control de inventario
- Alertas de stock bajo

## API Endpoints

### Autenticación
- POST /api/auth/login
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

### Productos
- GET /api/productos
- POST /api/productos
- PUT /api/productos/:id
- DELETE /api/productos/:id

### Ventas
- GET /api/ventas
- POST /api/ventas
- GET /api/ventas/:id
- PATCH /api/ventas/:id/estado

## Seguridad Implementada

### Autenticación
- JWT (JSON Web Tokens)
- Contraseñas hasheadas con bcrypt
- Tokens de acceso con expiración

### Autorización
- Middleware de verificación de roles
- Protección de rutas sensibles
- Validación de permisos por endpoint

### Datos
- Sanitización de entradas
- Validación de datos
- Protección contra SQL Injection
- CORS configurado

## Acceso al Sistema

### Usuarios por Defecto

#### Administrador
- Email: admin@novasalud.com
- Contraseña: admin123

#### Vendedor
- Email: vendedor@novasalud.com
- Contraseña: admin123

## Estructura del Proyecto
```
nova-salud/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── database/
    └── script.sql 