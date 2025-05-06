# Nova Salud - Sistema de Gestión de Farmacia

## Descripción
Sistema de gestión integral para la farmacia Nova Salud, que permite administrar inventario, ventas, clientes y usuarios.

## Enlaces de Producción
- Frontend: https://proyectofinal-snowy.vercel.app
- Backend: https://novasalud.onrender.com

## Tecnologías Utilizadas

### Frontend
- React 18.x
- Vite
- Material-UI (MUI)
- Axios
- React Router DOM
- Formik & Yup
- Context API para manejo de estado

### Backend
- Node.js 18.x
- Express 4.x
- MySQL 8.0 (Railway)
- Sequelize 6.x
- JWT para autenticación
- bcryptjs para encriptación
- Winston para logging

## Estructura del Proyecto
```
nova-salud/
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/      # Contextos de React (Auth, etc.)
│   │   ├── hooks/        # Custom hooks
│   │   ├── layouts/      # Layouts de la aplicación
│   │   ├── pages/        # Páginas/Vistas
│   │   ├── services/     # Servicios de API
│   │   └── utils/        # Utilidades
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/       # Configuraciones
│   │   ├── controllers/  # Controladores
│   │   ├── middleware/   # Middlewares
│   │   ├── models/       # Modelos Sequelize
│   │   ├── routes/       # Rutas de la API
│   │   └── app.js        # Entrada principal
│   └── package.json
└── database/
    └── script.sql        # Script de inicialización
```

## Características Principales

### Gestión de Usuarios
- Roles: Administrador y Vendedor
- Autenticación JWT
- Refresh tokens
- Perfiles de usuario

### Gestión de Inventario
- CRUD de productos
- Control de stock
- Alertas de stock bajo
- Categorización de productos
- Gestión de proveedores

### Sistema de Ventas
- Registro de ventas
- Múltiples métodos de pago
- Historial de transacciones
- Gestión de clientes

### Seguridad
- Autenticación JWT
- Contraseñas hasheadas
- Protección CORS
- Validación de datos
- Manejo de roles y permisos

## Configuración del Proyecto

### Variables de Entorno

#### Backend (.env)
```env
NODE_ENV=production
PORT=4000
DB_HOST=your-railway-host
DB_USER=your-railway-user
DB_PASSWORD=your-railway-password
DB_NAME=your-railway-database
DB_PORT=your-railway-port
JWT_SECRET=your-secret
JWT_EXPIRES_IN=24h
CORS_ORIGINS=https://proyectofinal-snowy.vercel.app
```

#### Frontend (.env)
```env
VITE_API_URL=https://novasalud.onrender.com/api
```

## Despliegue

### Frontend (Vercel)
1. Conectar con repositorio de GitHub
2. Framework Preset: Vite
3. Root Directory: ./frontend
4. Build Command: npm run build
5. Output Directory: dist
6. Configurar variables de entorno:
   - VITE_API_URL=https://novasalud.onrender.com/api

### Backend (Render)
1. Conectar con repositorio de GitHub
2. Runtime: Node.js
3. Build Command: npm install
4. Start Command: npm start
5. Configurar variables de entorno según .env
6. Habilitar Auto-Deploy

### Base de Datos (Railway)
- MySQL 8.0
- Configuración SSL habilitada
- Conexión segura mediante variables de entorno

## Acceso al Sistema

### Credenciales por Defecto

#### Administrador
- Email: admin@novasalud.com
- Contraseña: Admin123!

## API Endpoints

### Autenticación
- POST /api/auth/login
- POST /api/auth/refresh-token
- GET /api/auth/perfil

### Usuarios
- GET /api/usuarios
- POST /api/usuarios
- PUT /api/usuarios/:id
- DELETE /api/usuarios/:id

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

## Mantenimiento

### Logs
- Error logs: /backend/logs/error.log
- Combined logs: /backend/logs/combined.log

### Backups
- Se recomienda backup diario de la base de datos
- Exportar datos usando mysqldump

## Soporte

Para soporte y consultas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## Licencia
ISC
