const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Bookstore API',
        version: '1.0.0',
        description: 'API documentation for the Bookstore application.',
    },
    servers: [
        {
            url: process.env.MONGO_URI,
            description: 'Local server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
