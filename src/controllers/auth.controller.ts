import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbPromise from "../config/db";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const db = await dbPromise;

    // Vérifie si l'utilisateur existe déjà
    const existing = await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // INSERT (sans RETURNING, SQLite ne renvoie pas les données directement)
    const result = await db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    // `result.lastID` contient l’ID inséré
    const user = await db.get(
      "SELECT id, username, email FROM users WHERE id = ?",
      [result.lastID]
    );

    // Génération d’un token JWT si besoin
    const token = jwt.sign({ id: user.id, username: user.username }, "secret", {
      expiresIn: "1h",
    });

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed"});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const db = await dbPromise;
    const user = await db.get("SELECT * FROM users WHERE email=?", [email]);

    if (!user)
      return res.status(401).json({
        error: "L'identifiant de connexion ou le mot de passe est incorrect",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({
        error: "L'identifiant de connexion ou le mot de passe est incorrect",
      });

    const token = jwt.sign(
      { id: user.id, mail: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "90d",
      }
    );

    res.status(200).json({
      token,
      info: { is_premium: user.is_premium, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
