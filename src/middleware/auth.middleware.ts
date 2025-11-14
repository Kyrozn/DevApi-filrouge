import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: number;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  // authHeader devrait être : "Bearer <token>"
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Accès refusé : Token manquant" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET non configuré");

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = decoded; // grâce au declare module, TS ne râle plus

    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};
