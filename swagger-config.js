const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Specify the OpenAPI version
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for Nawait Book",
    },
    servers: [
      {
        url: "https://th-backend-kd10.onrender.com/", // Update with your API's base URL
      },
    ],
  },

  // Path to the API routes
  apis: ["./routes/*.js", "./auth/auth.js"], // Update this path to match your actual route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
