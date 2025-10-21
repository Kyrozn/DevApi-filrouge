// auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dbPromise from "../config/db";

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const AdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
  const { refresh } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const secret = process.env.JWT_SECRET || "changeme";
    const decoded = jwt.verify(token, secret) as JwtPayload;
console.log(decoded)
    const db = await dbPromise;
    const { role, refresh_token } = await db.get(
      "SELECT role, refresh_token FROM users WHERE id = ?",
      [decoded.id]
    );
    if (role !== "admin") {
      return res
        .status(401)
        .json({ message: "Accès refusé, vous n'etes pas administrateur" });
    }
    if (refresh !== refresh_token) {
      return res.status(401).json({ message: "Accès refusé" });
    }
    // @ts-ignore : on ajoute user dynamiquement
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide "+err+" "+token });
  }
};
