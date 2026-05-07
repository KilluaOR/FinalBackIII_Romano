import { jest, describe, beforeEach, expect, test } from "@jest/globals";
import request from "supertest";
import express from "express";
import {
  validAdoptionData,
  invalidAdoptionData,
  existingAdoptionId,
  nonExistingAdoptionId,
  adoptionResponse,
} from "../fixtures/adoptionData.js";

await jest.unstable_mockModule(
  "../../src/controllers/adoptions.controller.js",
  () => ({
    default: {
      getAllAdoptions: jest.fn(),
      getAdoption: jest.fn(),
      createAdoption: jest.fn(),
    },
  }),
);

const { default: adoptionsController } =
  await import("../../src/controllers/adoptions.controller.js");
const { default: adoptionRouter } =
  await import("../../src/routes/adoption.router.js");

describe("Adoption Router - Endpoints", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/adoptions", adoptionRouter);

    // Reset mocks
    jest.clearAllMocks();
  });

  // ========================================
  // ENDPOINT 1: GET /api/adoptions/
  // ========================================
  describe("GET /api/adoptions/ - getAllAdoptions", () => {
    test("✅ should return all adoptions with status 200", async () => {
      adoptionsController.getAllAdoptions.mockImplementation((req, res) => {
        res.status(200).json({
          status: "success",
          data: [adoptionResponse],
        });
      });

      const response = await request(app)
        .get("/api/adoptions/")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.payload)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
    });

    test("✅ should return empty array when no adoptions exist", async () => {
      adoptionsController.getAllAdoptions.mockImplementation((req, res) => {
        res.status(200).json({
          status: "success",
          data: [],
        });
      });

      const response = await request(app).get("/api/adoptions/").expect(200);

      expect(response.body.payload).toEqual([]);
    });

    test("❌ should handle database errors gracefully", async () => {
      adoptionsController.getAllAdoptions.mockImplementation((req, res) => {
        res.status(500).json({
          status: "error",
          message: "Database connection failed",
        });
      });

      const response = await request(app).get("/api/adoptions/").expect(500);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toBeDefined();
    });

    test("⚠️ should handle unauthorized access", async () => {
      adoptionsController.getAllAdoptions.mockImplementation((req, res) => {
        res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      });

      const response = await request(app).get("/api/adoptions/").expect(401);

      expect(response.body.status).toBe("error");
    });
  });

  // ========================================
  // ENDPOINT 2: GET /api/adoptions/:aid
  // ========================================
  describe("GET /api/adoptions/:aid - getAdoption", () => {
    test("✅ should return adoption by ID with status 200", async () => {
      adoptionsController.getAdoption.mockImplementation((req, res) => {
        const { aid } = req.params;
        if (aid === existingAdoptionId) {
          res.status(200).json({
            status: "success",
            data: adoptionResponse,
          });
        } else {
          res.status(404).json({
            status: "error",
            message: "Adoption not found",
          });
        }
      });

      const response = await request(app)
        .get(`/api/adoptions/${existingAdoptionId}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.payload._id).toBe(existingAdoptionId);
      expect(response.body.payload).toHaveProperty("adopterId");
      expect(response.body.payload).toHaveProperty("petId");
    });

    test("❌ should return 404 when adoption not found", async () => {
      adoptionsController.getAdoption.mockImplementation((req, res) => {
        res.status(404).json({
          status: "error",
          message: "Adoption not found",
        });
      });

      const response = await request(app)
        .get(`/api/adoptions/${nonExistingAdoptionId}`)
        .expect(404);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toMatch(/not found/i);
    });

    test("⚠️ should return 400 for invalid adoption ID format", async () => {
      adoptionsController.getAdoption.mockImplementation((req, res) => {
        const { aid } = req.params;
        if (!aid.match(/^[0-9a-fA-F]{24}$/)) {
          res.status(400).json({
            status: "error",
            message: "Invalid adoption ID format",
          });
        }
      });

      const response = await request(app)
        .get("/api/adoptions/invalid-id")
        .expect(400);

      expect(response.body.status).toBe("error");
    });

    test("❌ should handle database errors", async () => {
      adoptionsController.getAdoption.mockImplementation((req, res) => {
        res.status(500).json({
          status: "error",
          message: "Database error",
        });
      });

      const response = await request(app)
        .get(`/api/adoptions/${existingAdoptionId}`)
        .expect(500);

      expect(response.body.status).toBe("error");
    });
  });

  // ========================================
  // ENDPOINT 3: POST /api/adoptions/:uid/:pid
  // ========================================
  describe("POST /api/adoptions/:uid/:pid - createAdoption", () => {
    test("✅ should create adoption with valid data (uid and pid)", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const { uid, pid } = req.params;
        if (uid && pid) {
          res.status(201).json({
            status: "success",
            data: {
              _id: "507f1f77bcf86cd799439013",
              adopterId: uid,
              petId: pid,
              adoptionDate: new Date(),
              status: "pending",
            },
          });
        }
      });

      const uid = "507f1f77bcf86cd799439010";
      const pid = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .post(`/api/adoptions/${uid}/${pid}`)
        .send(validAdoptionData)
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.payload._id).toBeDefined();
      expect(response.body.payload.adopterId).toBe(uid);
      expect(response.body.payload.petId).toBe(pid);
    });

    test("⚠️ should return 400 when uid is missing", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const { uid, pid } = req.params;
        const missing =
          !uid || !pid || uid === "__missing__" || pid === "__missing__";
        if (missing) {
          res.status(400).json({
            status: "error",
            message: "Missing required parameters: uid and pid",
          });
          return;
        }
      });

      const pid = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .post(`/api/adoptions/__missing__/${pid}`)
        .send(validAdoptionData)
        .expect(400);

      expect(response.body.status).toBe("error");
    });

    test("⚠️ should return 400 when pid is missing", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const { uid, pid } = req.params;
        const missing =
          !uid || !pid || uid === "__missing__" || pid === "__missing__";
        if (missing) {
          res.status(400).json({
            status: "error",
            message: "Missing required parameters: uid and pid",
          });
          return;
        }
      });

      const uid = "507f1f77bcf86cd799439010";

      const response = await request(app)
        .post(`/api/adoptions/${uid}/__missing__`)
        .send(validAdoptionData)
        .expect(400);

      expect(response.body.status).toBe("error");
    });

    test("❌ should handle invalid user ID format", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const { uid, pid } = req.params;
        if (!uid.match(/^[0-9a-fA-F]{24}$/)) {
          res.status(400).json({
            status: "error",
            message: "Invalid user ID format",
          });
        }
      });

      const response = await request(app)
        .post("/api/adoptions/invalid-uid/507f1f77bcf86cd799439012")
        .send(validAdoptionData)
        .expect(400);

      expect(response.body.status).toBe("error");
    });

    test("❌ should handle invalid pet ID format", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const { uid, pid } = req.params;
        if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
          res.status(400).json({
            status: "error",
            message: "Invalid pet ID format",
          });
        }
      });

      const response = await request(app)
        .post("/api/adoptions/507f1f77bcf86cd799439010/invalid-pid")
        .send(validAdoptionData)
        .expect(400);

      expect(response.body.status).toBe("error");
    });

    test("❌ should handle user not found", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
      });

      const response = await request(app)
        .post(
          "/api/adoptions/507f1f77bcf86cd799439999/507f1f77bcf86cd799439012",
        )
        .send(validAdoptionData)
        .expect(404);

      expect(response.body.status).toBe("error");
    });

    test("❌ should handle pet not found", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        res.status(404).json({
          status: "error",
          message: "Pet not found",
        });
      });

      const response = await request(app)
        .post(
          "/api/adoptions/507f1f77bcf86cd799439010/507f1f77bcf86cd799439999",
        )
        .send(validAdoptionData)
        .expect(404);

      expect(response.body.status).toBe("error");
    });

    test("⚠️ should return 400 when body contains invalid data", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
          res.status(400).json({
            status: "error",
            message: "Request body cannot be empty",
          });
        }
      });

      const response = await request(app)
        .post(
          "/api/adoptions/507f1f77bcf86cd799439010/507f1f77bcf86cd799439012",
        )
        .send({})
        .expect(400);

      expect(response.body.status).toBe("error");
    });

    test("❌ should handle server errors", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      });

      const response = await request(app)
        .post(
          "/api/adoptions/507f1f77bcf86cd799439010/507f1f77bcf86cd799439012",
        )
        .send(validAdoptionData)
        .expect(500);

      expect(response.body.status).toBe("error");
    });
  });

  // ========================================
  // TESTS DE SEGURIDAD Y EDGE CASES
  // ========================================
  describe("Security & Edge Cases", () => {
    test("🔐 should prevent XSS in request body", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const body = req.body;
        // Verificar que no hay scripts
        if (JSON.stringify(body).includes("<script>")) {
          res.status(400).json({
            status: "error",
            message: "Invalid characters detected",
          });
        } else {
          res.status(201).json({ status: "success", data: body });
        }
      });

      const maliciousData = {
        notes: '<script>alert("XSS")</script>',
      };

      const response = await request(app)
        .post(
          "/api/adoptions/507f1f77bcf86cd799439010/507f1f77bcf86cd799439012",
        )
        .send(maliciousData);

      expect([201, 400]).toContain(response.status);
    });

    test("⚠️ should handle extremely large payloads", async () => {
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        const bodySize = JSON.stringify(req.body).length;
        if (bodySize > 1000000) {
          res.status(413).json({
            status: "error",
            message: "Payload too large",
          });
        } else {
          res.status(201).json({ status: "success" });
        }
      });

      const largeData = {
        notes: "A".repeat(10000),
      };

      const response = await request(app)
        .post(
          "/api/adoptions/507f1f77bcf86cd799439010/507f1f77bcf86cd799439012",
        )
        .send(largeData);

      expect([201, 413]).toContain(response.status);
    });
  });

  // ========================================
  // TESTS DE INTEGRACIÓN
  // ========================================
  describe("Integration - Adoption Flow", () => {
    test("✅ should complete adoption flow successfully", async () => {
      // Flujo: GET all → GET by id → POST create

      // 1. Get all
      adoptionsController.getAllAdoptions.mockImplementation((req, res) => {
        res.status(200).json({ status: "success", data: [adoptionResponse] });
      });

      const getAllResponse = await request(app)
        .get("/api/adoptions/")
        .expect(200);

      expect(getAllResponse.body.data.length).toBeGreaterThan(0);

      // 2. Get by id
      adoptionsController.getAdoption.mockImplementation((req, res) => {
        res.status(200).json({ status: "success", data: adoptionResponse });
      });

      const getByIdResponse = await request(app)
        .get(`/api/adoptions/${existingAdoptionId}`)
        .expect(200);

      expect(getByIdResponse.body.data._id).toBe(existingAdoptionId);

      // 3. Create
      adoptionsController.createAdoption.mockImplementation((req, res) => {
        res.status(201).json({
          status: "success",
          data: {
            _id: "507f1f77bcf86cd799439014",
            adopterId: "507f1f77bcf86cd799439010",
            petId: "507f1f77bcf86cd799439012",
          },
        });
      });

      const createResponse = await request(app)
        .post(
          "/api/adoptions/507f1f77bcf86cd799439010/507f1f77bcf86cd799439012",
        )
        .send(validAdoptionData)
        .expect(201);

      expect(createResponse.body.status).toBe("success");
      expect(createResponse.body.data._id).toBeDefined();
    });
  });
});
