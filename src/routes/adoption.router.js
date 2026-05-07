import { Router } from "express";
import adoptionsController from "../controllers/adoptions.controller.js";

const router = Router();

/**
 * @swagger
 * /api/adoptions/:
 *   get:
 *     summary: Obtener todas las adopciones
 *     description: Retorna el listado de adopciones (campo `payload`).
 *     tags:
 *       - Adoptions
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionSuccessList'
 *       500:
 *         description: Error del servidor
 */
router.get("/", adoptionsController.getAllAdoptions);

/**
 * @swagger
 * /api/adoptions/{aid}:
 *   get:
 *     summary: Obtener adopción por ID
 *     tags:
 *       - Adoptions
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: ID de la adopción (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Adopción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionSuccessOne'
 *       404:
 *         description: No encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionError'
 *             example:
 *               status: error
 *               error: Adoption not found
 */
router.get("/:aid", adoptionsController.getAdoption);

/**
 * @swagger
 * /api/adoptions/{uid}/{pid}:
 *   post:
 *     summary: Registrar adopción (usuario + mascota)
 *     description: |
 *       Vincula usuario y mascota. Respuesta exitosa usa HTTP 200 con `{ status, message }`.
 *       Errores usan `{ status, error }`.
 *     tags:
 *       - Adoptions
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: "507f1f77bcf86cd799439010"
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: "507f1f77bcf86cd799439012"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: "Notas opcionales"
 *     responses:
 *       200:
 *         description: Adopción registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionCreated'
 *       400:
 *         description: Mascota ya adoptada u otro error de negocio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionError'
 *             example:
 *               status: error
 *               error: Pet is already adopted
 *       404:
 *         description: Usuario o mascota inexistente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionError'
 */
router.post("/:uid/:pid", adoptionsController.createAdoption);

export default router;
