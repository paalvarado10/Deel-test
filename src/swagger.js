const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Deel Backend test Pablo Alvarado',
      description: 'Deel Backend Api test',
      servers: ['http://localhost:3001'],
    },
  },
  basePath: '/',
  apis: [
    'src/routers/**/*.js',
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = { swaggerDocs, swaggerUi };
