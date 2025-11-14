import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { createEvent, GetAllEvent } from "../controllers/event.controller"
const router = Router();

/**
 * @openapi
 * tags:
 *   name: event
 *   description: .
 * 
 */
/**
 * @openapi
 * /event:
 *   post:
 *     summary: Crée un nouvel événement
 *     description: Cette route permet à un utilisateur authentifié de créer un nouvel événement. Un token JWT valide doit être fourni dans le header `Authorization`.
 *     tags: [event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sport
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tournoi Mario Kart"
 *               sport:
 *                 type: string
 *                 example: "Karting"
 *               location:
 *                 type: string
 *                 example: "Salle Arcade Lyon"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-20 18:00:00"
 *     responses:
 *       200:
 *         description: Événement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "L'évenement a bien été créé"
 *       400:
 *         description: Données manquantes (nom ou sport non fournis)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Valeurs manquants"
 *       401:
 *         description: Accès refusé, token manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Accès refusé, token manquant"
 *       403:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token invalide"
 *       500:
 *         description: Erreur interne du serveur (échec de la création)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "L'évenement na pas pu etre créé"
 */

router.post("/", authenticateToken, createEvent);

/**
 * @openapi
 * /event:
 *   get:
 *     summary: Récupère la liste des événements
 *     description: Cette route retourne la liste paginée des événements présents dans la base de données. Elle nécessite un token JWT valide dans le header `Authorization`.
 *     tags: [event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Numéro de la page à récupérer (par défaut 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 15
 *         description: Nombre d'événements à afficher par page (par défaut 15)
 *     responses:
 *       200:
 *         description: Liste des événements récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 15
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Tournoi Mario Kart"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-20T18:00:00Z"
 *                       location:
 *                         type: string
 *                         example: "Salle Arcade Lyon"
 *                       description:
 *                         type: string
 *                         example: "Un tournoi amical ouvert à tous les joueurs."
 *       401:
 *         description: Accès refusé, token manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Accès refusé, token manquant"
 *       403:
 *         description: Token invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token invalide"
 *       500:
 *         description: Erreur interne du serveur (échec de la récupération des événements)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la récupération des événements"
 */
router.get("/", authenticateToken, GetAllEvent);

export default router;
