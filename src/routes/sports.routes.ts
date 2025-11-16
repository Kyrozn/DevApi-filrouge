import { Router } from "express";
import {
  fetchLeagues,
} from "../controllers/sport.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sports
 *   description: API TheSportsDB
 */

/**
 * @swagger
 * /sports/leagues:
 *   get:
 *     summary: Récupère toutes les ligues
 *     tags: [Sports]
 *     responses:
 *       200:
 *         description: Liste des ligues
 *       500:
 *         description: Erreur API
 */
router.get("/leagues", fetchLeagues);

export default router;
