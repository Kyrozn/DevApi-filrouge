import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "../config/db";
import app from "../index";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("Crée un utilisateur avec succès", async () => {
      const dbMock = {
        get: jest
          .fn()
          .mockResolvedValueOnce(undefined) // aucun utilisateur existant
          .mockResolvedValueOnce({ id: 1, username: "test", email: "a@b.com" }), // utilisateur créé
        run: jest.fn().mockResolvedValue({ lastID: 1 }),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pwd");
      (jwt.sign as jest.Mock).mockReturnValue("jwt_token");

      const res = await request(app).post("/auth/register").send({
        username: "test",
        email: "a@b.com",
        password: "123456789012", // mot de passe >= 12 caractères
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual({
        id: 1,
        username: "test",
        email: "a@b.com",
      });
      expect(res.body.token).toBe("jwt_token");
      expect(dbMock.get).toHaveBeenCalledTimes(2);
      expect(dbMock.run).toHaveBeenCalled();
    });

    it("Retourne 400 si champs manquants", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "a@b.com" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Missing fields");
    });

    it("Retourne 400 si email déjà utilisé", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({ id: 1, email: "a@b.com" }),
        run: jest.fn(),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).post("/auth/register").send({
        username: "test",
        email: "a@b.com",
        password: "123456789012",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email already in use");
    });
  });


  describe("POST /auth/login", () => {
    it("Connexion réussie (user normal)", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({
          id: 1,
          email: "a@b.com",
          password: "hashed_pwd",
          role: "user",
          is_premium: false,
          username: "testUser",
        }),
        run: jest.fn(),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("access_token");

      const res = await request(app).post("/auth/login").send({
        email: "a@b.com",
        password: "123456789012",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("access_token");
      expect(res.body.info).toEqual({
        username: "testUser",
        role: "user",
        is_premium: false,
      });
    });

    it("Retourne 400 si champs manquants", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "a@b.com" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Missing fields");
    });

    it("Retourne 401 si utilisateur inexistant", async () => {
      const dbMock = { get: jest.fn().mockResolvedValue(undefined) };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).post("/auth/login").send({
        email: "a@b.com",
        password: "123456789012",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });

    it("Retourne 401 si mot de passe incorrect", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({
          id: 1,
          email: "a@b.com",
          password: "hashed_pwd",
        }),
        run: jest.fn(),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = await request(app).post("/auth/login").send({
        email: "a@b.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });

    it("Retourne 500 en cas d'erreur serveur", async () => {
      (getDb as jest.Mock).mockRejectedValue(new Error("DB down"));

      const res = await request(app).post("/auth/login").send({
        email: "a@b.com",
        password: "123456789012",
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Login failed");
    });
  });

  describe("POST /auth/refresh", () => {
    it("Génère un nouveau token pour un admin valide", async () => {
      const dbMock = {
        get: jest.fn().mockResolvedValue({
          id: 16,
          email: "a@b.com",
          role: "admin",
          refresh_token: "good_token",
        }),
        run: jest.fn(),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);
      (jwt.sign as jest.Mock).mockReturnValue("new_access_token");

      const res = await request(app).post("/auth/refresh").send({
        email: "a@b.com",
        refreshToken: "good_token",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("new_access_token");
      expect(dbMock.run).toHaveBeenCalled(); // rotation refresh token
    });

    it("Retourne 400 si credentials manquants", async () => {
      const res = await request(app).post("/auth/refresh").send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Missing fields");
    });

    it("Retourne 404 si utilisateur introuvable", async () => {
      const dbMock = { get: jest.fn().mockResolvedValue(undefined) };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).post("/auth/refresh").send({
        email: "a@b.com",
        refreshToken: "x",
      });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });

    it("Retourne 401 si refreshToken invalide", async () => {
      const dbMock = {
        get: jest
          .fn()
          .mockResolvedValue({ role: "admin", refresh_token: "expected" }),
        run: jest.fn(),
      };
      (getDb as jest.Mock).mockResolvedValue(dbMock);

      const res = await request(app).post("/auth/refresh").send({
        email: "a@b.com",
        refreshToken: "wrong",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid refresh token");
    });

    it("Retourne 500 en cas d’erreur serveur", async () => {
      (getDb as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/auth/refresh").send({
        email: "a@b.com",
        refreshToken: "x",
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to refresh token");
    });
  });
});
