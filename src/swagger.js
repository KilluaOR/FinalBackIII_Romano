import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "AdopMe API",
      version: "1.0.0",
      description: "API para la gestión de adopciones de mascotas",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local (PORT por defecto en Docker / index.js)",
      },
      {
        url: "http://localhost:8080",
        description: "Local alternativo (si PORT=8080)",
      },
    ],
    components: {
      schemas: {
        Adoption: {
          type: "object",
          description: "Documento de adopción (forma típica en respuestas)",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            owner: { type: "string", description: "ObjectId del usuario" },
            pet: { type: "string", description: "ObjectId de la mascota" },
          },
        },
        AdoptionError: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            error: { type: "string", example: "Adoption not found" },
          },
        },
        AdoptionSuccessList: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            payload: {
              type: "array",
              items: { $ref: "#/components/schemas/Adoption" },
            },
          },
        },
        AdoptionSuccessOne: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            payload: { $ref: "#/components/schemas/Adoption" },
          },
        },
        AdoptionCreated: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            message: { type: "string", example: "Pet adopted" },
          },
        },
      },
    },
  },
  apis: ["./src/docs/**/*.yaml", "./src/routes/adoption.router.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
