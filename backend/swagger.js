const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

// Function to dynamically fetch all route files
const getAllRouteFiles = () => {
  const routesPath = path.join(__dirname, "routes");
  return fs.readdirSync(routesPath).map((file) => `./routes/${file}`);
};

// Define Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Synix API", version: "1.0.0" },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: getAllRouteFiles(), // Automatically fetches all route files
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
