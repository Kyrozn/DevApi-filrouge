import { Router } from "express";
import { register, login, refresh } from "../controllers/auth.controller";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: auth
 *   description: .
 * 
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Cette route permet d'enregistrer un nouvel utilisateur dans la base de données. Elle vérifie si l'email existe déjà et renvoie un token JWT si la création réussit.
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: JeanDupont
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean.dupont@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: JeanDupont
 *                     email:
 *                       type: string
 *                       example: jean.dupont@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Champs manquants ou email déjà utilisé
 *                      Email invalide ou Mot de passe invalide
 *       500:
 *         description: Erreur interne du serveur (échec de l'inscription)
 */
router.post("/register", register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: Cette route permet à un utilisateur de se connecter. Elle vérifie les identifiants et renvoie un token JWT, et un refresh token pour les admins.
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   nullable: true
 *                   example: d3b07384d113edec49eaa6238ad5ff00...
 *                 info:
 *                   type: object
 *                   properties:
 *                     is_premium:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: admin
 *       400:
 *         description: Champs manquants
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/login", login);

router.post("/refresh", refresh);

export default router;
