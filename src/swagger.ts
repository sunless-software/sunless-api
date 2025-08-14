import swaggerJSDoc from "swagger-jsdoc";
import { API_DEFAULT_PORT } from "./constants/setup";
import path from "path";

const port = process.env.PORT || API_DEFAULT_PORT;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Sunless API",
    version: "1.0.0",
    description: "Documentation for SunlessAPI",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "documentation", "*.js")],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
