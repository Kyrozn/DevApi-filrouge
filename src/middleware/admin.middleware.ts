import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès interdit : Admin uniquement" });
  }

  next();
};
