import request from "supertest";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import app from "../index";
import { getDb } from "../config/db";
import {
  getMyProfil,
  getUserProfil,
  UpdateProfil,
  DeleteUser,
} from "../controllers/user.controller";

jest.mock("../config/db");
jest.mock("bcrypt");

app.get("/profil", (req: any, res: Response) => {
  req.user = { id: 1 };
  return getMyProfil(req, res);
});

app.get("/profil/:id", (req: Request, res: Response) =>
  getUserProfil(req, res)
);

app.put("/", (req: any, res: Response) => {
  req.user = { id: 1 };
  return UpdateProfil(req, res);
});

app.delete("/", (req: any, res: Response) => {
  req.user = { id: 1 };
  return DeleteUser(req, res);
});

describe("ProfilController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("GET /profil", () => {
    it("✅ retourne le profil de l'utilisateur connecté", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({
          id: 1,
          username: "John",
          email: "john@doe.fr",
          first_name: "John",
          last_name: "Doe",
          bio: "Hello",
          avatar_url: "avatar.jpg",
        }),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).get("/profil");

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe("John");
      expect(dbMock.get).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = ?",
        [1]
      );
    });

    it("Retourne 404 si utilisateur introuvable", async () => {
      const dbMock = { get: jest.fn().mockResolvedValue(undefined) };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).get("/profil");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Utilisateur introuvable");
    });

    it("Retourne 500 en cas d'erreur serveur", async () => {
      (getDb as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/profil");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erreur serveur");
    });
  });

  describe("GET /profil/:id", () => {
    it("Retourne le profil d’un utilisateur spécifique", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({
          id: 2,
          username: "Alice",
          first_name: "Alice",
          last_name: "Smith",
          bio: "Bio",
          avatar_url: "avatar2.png",
        }),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).get("/profil/2");

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe("Alice");
      expect(dbMock.get).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id=?",
        ["2"]
      );
    });

    it("Retourne 500 si une erreur survient", async () => {
      (getDb as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/profil/2");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erreur serveur");
    });
  });

  // ----------------- PUT / -----------------
  describe("PUT /", () => {
    it("Met à jour le profil avec succès", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({ id: 1 }),
        run: jest.fn().mockResolvedValue({ changes: 1 }),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).put("/").send({
        username: "NewName",
        email: "new@mail.com",
        first_name: "New",
        last_name: "User",
        bio: "Updated bio",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Le profil a été mis à jour");
      expect(dbMock.run).toHaveBeenCalled();
    });

    it("Retourne 404 si utilisateur introuvable", async () => {
      const dbMock = { get: jest.fn().mockResolvedValue(undefined) };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).put("/").send({});

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Utilisateur introuvable.");
    });

    it("Retourne 500 en cas d’erreur serveur", async () => {
      (getDb as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res = await request(app).put("/").send({});

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erreur serveur");
    });
  });

  // ----------------- DELETE / -----------------
  describe("DELETE /", () => {
    it("Retourne 400 si mot de passe non fourni", async () => {
      const res = await request(app).delete("/").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Mot de passe requis.");
    });

    it("Retourne 404 si utilisateur introuvable", async () => {
      const dbMock = { get: jest.fn().mockResolvedValue(undefined) };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).delete("/").send({ passwordTest: "123" });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Utilisateur introuvable.");
    });

    it("Retourne 401 si mot de passe incorrect", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({
          username: "John",
          password: "hashed_pwd",
        }),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .delete("/")
        .send({ passwordTest: "wrong" });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Mot de passe incorrect.");
    });

    it("Supprime l'utilisateur avec succès", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({
          username: "John",
          password: "hashed_pwd",
        }),
        run: jest.fn().mockResolvedValue({ changes: 1 }),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const res = await request(app).delete("/").send({ passwordTest: "123" });
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/supprimé avec succès/);
    });

    it("Retourne 500 si erreur serveur", async () => {
      (getDb as jest.Mock).mockRejectedValue(new Error("DB down"));

      const res = await request(app).delete("/").send({ passwordTest: "123" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erreur interne du serveur.");
    });
  });
});
