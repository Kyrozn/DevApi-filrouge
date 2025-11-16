import request from "supertest";
import { Request, Response } from "express";
import app from "../index";
import { setMod } from "../controllers/admin.controller";
import { getDb } from "../config/db";

// Route temporaire pour tester le contrôleur
app.post("/admin/setMod", (req: Request, res: Response) => {
  (req as any).user = { id: 1 }; // simule un utilisateur connecté
  return setMod(req, res);
});

describe("AdminController - setMod", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Devrait modifier le rôle d'un utilisateur avec succès", async () => {
    const dbMock = {
      get: jest.fn().mockResolvedValue({ id: 2, username: "UserTest" }),
      run: jest.fn().mockResolvedValue({ changes: 1 }),
    };
    (getDb as jest.Mock).mockResolvedValue(dbMock);

    const res = await request(app).post("/admin/setMod").send({ id: 2 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Le role a bien été modifié");
    expect(dbMock.get).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [2]
    );
    expect(dbMock.run).toHaveBeenCalledWith(
      "UPDATE users SET role = ? WHERE id = ?",
      ["moderator", 2]
    );
  });

  it("Devrait retourner 404 si l'utilisateur n'existe pas", async () => {
    const dbMock = { get: jest.fn().mockResolvedValue(undefined) };
    (getDb as jest.Mock).mockResolvedValue(dbMock);

    const res = await request(app).post("/admin/setMod").send({ id: 2 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Utilisateur introuvable");
    expect(dbMock.get).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [2]
    );
  });

  it("Devrait retourner 500 en cas d'erreur serveur", async () => {
    (getDb as jest.Mock).mockRejectedValue(new Error("Erreur DB"));

    const res = await request(app).post("/admin/setMod").send({ id: 2 });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erreur serveur");
  });
});