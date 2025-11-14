import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import EventRoutes from "../routes/event.routes";
import { getDb } from "../config/db";

// Mock du middleware d'authentification
jest.mock("../middleware/auth.middleware.ts", () => ({
  authenticateToken: (req: Request, res: Response, next: NextFunction) => {
    (req as any).user = { id: 1 }; // Simule un utilisateur connecté
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/event", EventRoutes);

describe("Event Routes", () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn(),
    };
    (getDb as jest.Mock).mockResolvedValue(mockDb); // Mock de la DB
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------
  // TEST CREATE EVENT (POST)
  // --------------------------
  describe("POST /event", () => {
    it("✅ crée un événement avec succès", async () => {
      mockDb.run.mockResolvedValue({ lastID: 1 });

      const res = await request(app).post("/event").send({
        name: "Tournoi Basket",
        sport: "Basket",
        location: "Paris",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("L'évenement a bien été créé");
      expect(mockDb.run).toHaveBeenCalled();
    });

    it("❌ retourne une erreur si valeurs manquantes", async () => {
      const res = await request(app).post("/event").send({
        name: "",
        sport: "",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Valeurs manquants");
    });

    it("💥 retourne une erreur serveur si DB échoue", async () => {
      mockDb.run.mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/event").send({
        name: "Test",
        sport: "Tennis",
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("L'évenement na pas pu etre créé");
    });
  });

  // --------------------------
  // TEST GET ALL EVENTS
  // --------------------------
  describe("GET /event", () => {
    it("✅ retourne les événements avec pagination", async () => {
      mockDb.all.mockResolvedValue([
        { id: 1, name: "Event 1" },
        { id: 2, name: "Event 2" },
      ]);
      mockDb.get.mockResolvedValue({ count: 2 });

      const res = await request(app).get("/event?page=1&limit=2");

      expect(res.status).toBe(200);
      expect(res.body.events.length).toBe(2);
      expect(res.body.total).toBe(2);
      expect(res.body.limit).toBe(2);
      expect(res.body.totalPages).toBe(1);
    });

    it("💥 retourne une erreur serveur", async () => {
      mockDb.all.mockRejectedValue(new Error("DB fail"));

      const res = await request(app).get("/event");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe(
        "Erreur lors de la récupération des événements"
      );
    });
  });
});
