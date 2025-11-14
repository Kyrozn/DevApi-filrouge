import { Response } from "express";
import { getDb } from "../config/db";
import { User } from "../models/user.model";

export const setMod = async (req: any, res: Response) => {
  try {
    const { id: userIdToModify } = req.body; // utilisateur à modifier
    const db = await getDb();

    const user = await db.get<User>("SELECT * FROM users WHERE id = ?", [
      userIdToModify,
    ]);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const result = await db.run("UPDATE users SET role = ? WHERE id = ?", [
      "moderator",
      userIdToModify,
    ]);

    if (result && result.changes && result.changes > 0) {
      return res.status(200).json({ message: "Le role a bien été modifié" });
    }

    return res.status(400).json({ error: "Impossible de modifier le rôle" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
