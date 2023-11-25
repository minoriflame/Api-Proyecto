const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Hotel API",
      description: "Hotel API Information",
      contact: {
        name: "Sebastian"
      },
      servers: ["http://localhost:3000"]
    }
  },
  apis: ["./routes/*.js", "./services/*.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const swagger = (app) => {
  app.use("/docs",  swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swagger;