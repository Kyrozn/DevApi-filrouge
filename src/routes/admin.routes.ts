import { Router } from "express";
import { setMod } from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/admin.middleware";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: admin
 *   description: .
 * 
 */

/**
 * @openapi
 * /admin/setMod:
 *   put:
 *     summary: Promouvoir un utilisateur en modérateur
 *     description: Cette route permet à un administrateur de changer le rôle d'un utilisateur pour "moderator". Requiert un token JWT valide et un refresh token.
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - refresh
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de l'utilisateur à promouvoir
 *                 example: 3
 *               refresh:
 *                 type: string
 *                 description: Refresh token de l'admin
 *                 example: d3b07384d113edec49eaa6238ad5ff00
 *     responses:
 *       200:
 *         description: Rôle de l'utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le role a bien été modifié
 *       401:
 *         description: Accès refusé (token manquant, invalide ou utilisateur non admin)
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/setMod", authenticateToken, requireAdmin, setMod);


export default router;
