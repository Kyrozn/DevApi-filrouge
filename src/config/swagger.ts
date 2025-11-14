import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

// 🔧 Configuration de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de mon projet",
      version: "1.0.0",
      description: "Documentation auto-générée avec Swagger",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            bio: { type: "string" },
            avatar_url: { type: "string" },
            is_premium: { type: "boolean" },
            role: { type: "string", enum: ["user", "admin"] },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
  },
  // Chemin vers les fichiers où se trouvent les annotations
  apis: [path.join(__dirname, "../routes/*")],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;