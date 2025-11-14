import { Request, Response } from "express";
import { getDb } from "../config/db";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

// Obtenir le profil de l'utilisateur connecté
export const getMyProfil = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const db = await getDb();

    const user = await db.get<User>("SELECT * FROM users WHERE id = ?", [id]);
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer le profil d’un utilisateur spécifique
export const getUserProfil = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    const user = await db.get<User>("SELECT * FROM users WHERE id=?", [id]);
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour son profil
export const UpdateProfil = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const { username, email, first_name, last_name, bio } = req.body;
    const db = await getDb();

    const user = await db.get<User>("SELECT * FROM users WHERE id=?", [id]);
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    const result = await db.run(
      "UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ?, bio = ? WHERE id=?",
      [username, email, first_name, last_name, bio, user.id]
    );

    if (result && result.changes && result.changes > 0) {
      return res.status(200).json({ message: "Le profil a été mis à jour" });
    }

    return res.status(400).json({ error: "Aucune modification effectuée." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer son compte
export const DeleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const { passwordTest } = req.body;

    if (!passwordTest)
      return res.status(400).json({ message: "Mot de passe requis." });

    const db = await getDb();
    const user = await db.get<User>(
      "SELECT username, password FROM users WHERE id=?",
      [id]
    );
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    const match = await bcrypt.compare(passwordTest, user.password);
    if (!match)
      return res.status(401).json({ message: "Mot de passe incorrect." });

    const result = await db.run("DELETE FROM users WHERE id=?", [id]);
    if (result && result.changes && result.changes > 0) {
      return res
        .status(200)
        .json({
          message: `L'utilisateur ${user.username} a été supprimé avec succès.`,
        });
    }

    return res.status(400).json({ message: "Échec de la suppression." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};
