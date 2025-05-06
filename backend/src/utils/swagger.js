const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Opciones de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Nova Salud',
      version: '1.0.0',
      description: 'API para el sistema de gestión de la botica Nova Salud',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'info@novasalud.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Rutas donde buscar anotaciones
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { explorer: true })
};