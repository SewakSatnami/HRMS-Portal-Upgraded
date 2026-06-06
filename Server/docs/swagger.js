import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HRMS SaaS API",
      version: "1.0.0",
      description: "Production-ready HRMS API for authentication, employees, attendance, leave, salary, and payslips."
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local development"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./Routes/*.js"]
});

export { swaggerUi };
