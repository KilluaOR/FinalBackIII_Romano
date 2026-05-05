import request from "supertest";
import express from "express";
import adoptionRouter from "../../src/routers/adoption.router.js";
import { createMockAdoptionService } from "../mocks/adoptionService.mock.js";

/**
 * TESTS FUNCIONALES - ADOPTION ROUTER
 *
 * Valida todos los endpoints del router de adopción
 * Cubre casos: éxito, error, validación
 * Cobertura esperada: >80%
 */

describe("Adoption Router", () => {
  let app;
  let mockAdoptionService;

  beforeEach(() => {
    // Crear aplicación de prueba
    app = express();
    app.use(express.json());

    // Inyectar mocks
    mockAdoptionService = createMockAdoptionService();

    // Montar router (necesita adaptarse a tu estructura)
    // app.use('/api/adoption', adoptionRouter(mockAdoptionService));
  });

  describe("GET /api/adoption - Obtener todas las adopciones", () => {
    test("should return all adoptions with status 200", async () => {
      const response = await request(app)
        .get("/api/adoption")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("petName");
    });

    test("should return empty array when no adoptions exist", async () => {
      mockAdoptionService.getAll.mockResolvedValueOnce([]);

      const response = await request(app).get("/api/adoption").expect(200);

      expect(response.body).toEqual([]);
    });

    test("should handle database errors gracefully", async () => {
      mockAdoptionService.getAll.mockRejectedValueOnce(
        new Error("Database connection failed"),
      );

      const response = await request(app).get("/api/adoption").expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/adoption/:id - Obtener adopción por ID", () => {
    test("should return adoption by id with status 200", async () => {
      const response = await request(app).get("/api/adoption/1").expect(200);

      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("petName");
    });

    test("should return 404 when adoption not found", async () => {
      const response = await request(app).get("/api/adoption/999").expect(404);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toMatch(/not found/i);
    });

    test("should return 400 for invalid id format", async () => {
      const response = await request(app)
        .get("/api/adoption/invalid-id")
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/adoption - Crear nueva adopción", () => {
    test("should create adoption with valid data", async () => {
      const validData = {
        petName: "Nuevo",
        adopterName: "Nuevo Adoptante",
        petType: "dog",
        adoptionDate: "2024-03-01",
      };

      const response = await request(app)
        .post("/api/adoption")
        .send(validData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.petName).toBe(validData.petName);
    });

    test("should return 400 when petName is missing", async () => {
      const invalidData = {
        adopterName: "Juan",
        petType: "dog",
      };

      const response = await request(app)
        .post("/api/adoption")
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toMatch(/petName/i);
    });

    test("should return 400 when adopterName is missing", async () => {
      const invalidData = {
        petName: "Max",
        petType: "dog",
      };

      const response = await request(app)
        .post("/api/adoption")
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    test("should return 400 when data is empty", async () => {
      const response = await request(app)
        .post("/api/adoption")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    test("should handle server errors during creation", async () => {
      mockAdoptionService.create.mockRejectedValueOnce(
        new Error("Database error"),
      );

      const response = await request(app)
        .post("/api/adoption")
        .send({
          petName: "Max",
          adopterName: "Juan",
        })
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/adoption/:id - Actualizar adopción", () => {
    test("should update adoption with valid data", async () => {
      const updateData = {
        adopterName: "Nombre Actualizado",
        status: "completed",
      };

      const response = await request(app)
        .put("/api/adoption/1")
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("id", 1);
    });

    test("should return 404 when adoption not found", async () => {
      const response = await request(app)
        .put("/api/adoption/999")
        .send({ adopterName: "Nuevo" })
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });

    test("should return 400 when update data is invalid", async () => {
      const response = await request(app)
        .put("/api/adoption/1")
        .send({ invalid_field: "value" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    test("should return 400 for invalid id format", async () => {
      const response = await request(app)
        .put("/api/adoption/invalid")
        .send({ adopterName: "Nuevo" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /api/adoption/:id - Eliminar adopción", () => {
    test("should delete adoption with status 204", async () => {
      const response = await request(app).delete("/api/adoption/1").expect(204);

      expect(response.body).toEqual({});
    });

    test("should return 404 when adoption not found", async () => {
      const response = await request(app)
        .delete("/api/adoption/999")
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });

    test("should return 400 for invalid id format", async () => {
      const response = await request(app)
        .delete("/api/adoption/invalid")
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/adoption/search - Buscar adopciones", () => {
    test("should search adoptions by status", async () => {
      const response = await request(app)
        .get("/api/adoption/search")
        .query({ status: "completed" })
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      if (response.body.length > 0) {
        expect(response.body[0].status).toBe("completed");
      }
    });

    test("should return empty array when no matches found", async () => {
      mockAdoptionService.search.mockResolvedValueOnce([]);

      const response = await request(app)
        .get("/api/adoption/search")
        .query({ status: "nonexistent" })
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test("should search by petName", async () => {
      const response = await request(app)
        .get("/api/adoption/search")
        .query({ petName: "Max" })
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    test("should handle search errors", async () => {
      mockAdoptionService.search.mockRejectedValueOnce(
        new Error("Search failed"),
      );

      const response = await request(app)
        .get("/api/adoption/search")
        .query({ status: "completed" })
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Edge Cases y Validaciones Adicionales", () => {
    test("should reject requests with invalid content-type", async () => {
      const response = await request(app)
        .post("/api/adoption")
        .set("Content-Type", "text/plain")
        .send("invalid")
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    test("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/adoption")
        .set("Content-Type", "application/json")
        .send("{invalid json}")
        .expect(400);
    });

    test("should reject requests with extremely large payloads", async () => {
      const largeData = {
        petName: "A".repeat(10000),
        adopterName: "Test",
      };

      const response = await request(app)
        .post("/api/adoption")
        .send(largeData)
        .expect(413); // Payload too large
    });

    test("should sanitize input data", async () => {
      const maliciousData = {
        petName: '<script>alert("xss")</script>',
        adopterName: "Test",
      };

      const response = await request(app)
        .post("/api/adoption")
        .send(maliciousData)
        .expect(201);

      // Verificar que el script no se ejecutó
      expect(response.body.petName).not.toContain("<script>");
    });
  });
});
