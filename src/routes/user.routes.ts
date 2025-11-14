import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  DeleteUser,
  getMyProfil,
  getUserProfil,
  UpdateProfil,
} from "../controllers/user.controller";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: user
 *   description: .
 * 
 */

/**
 * @openapi
 * /user/profil:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     description: Cette route renvoie les informations du profil de l'utilisateur actuellement authentifié. Requiert un token JWT.
 *     tags: [user] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/User'
 *       401:
 *         description: Accès refusé (token manquant ou invalide)
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/profil', authenticateToken, getMyProfil);


router.get('/profil/:id', authenticateToken, getUserProfil)

/**
 * @openapi
 * /user:
 *   delete:
 *     summary: Supprime l'utilisateur connecté
 *     description: Cette route permet à l'utilisateur connecté de supprimer son compte après avoir fourni son mot de passe. Requiert un token JWT.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordTest
 *             properties:
 *               passwordTest:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: L'utilisateur JeanDupont a été supprimé avec succès.
 *       400:
 *         description: Mot de passe requis
 *       401:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur introuvable ou échec de la suppression
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/", authenticateToken, DeleteUser);

/**
 * @openapi
 * /user:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     description: Cette route permet à l'utilisateur authentifié de mettre à jour son profil. Requiert un token JWT.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le profil a été mis à jour
 *       400:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/", authenticateToken, UpdateProfil);


export default router;
