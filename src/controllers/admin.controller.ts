import { response, Response } from "express";
import dbPromise from "../config/db";
import { User } from "../models/user.model";

export const setMod = async (req: any, res: Response) => {
  try {
    const { id } = req.user;
    const body = req.body;
    const db = await dbPromise;

    const user = await db.get<User>("SELECT * FROM users WHERE id = ?", [id]);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const result = await db.run("UPDATE users SET role = ? WHERE id = ?", [
      "moderator",
      body.id,
    ]);
    if (result && result.changes && result.changes > 0) {
      return res.status(200).json({ message: "Le role a bien étais modifié" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
