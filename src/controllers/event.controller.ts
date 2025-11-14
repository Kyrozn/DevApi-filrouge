import { Response, Request } from "express";
import { getDb } from "../config/db";

export const createEvent = async (req: any, res: Response) => {
  try {
    const { name, sport, location, date } = req.body;
    const organizerId = req.user.id;
    if (!name || !sport) {
      return res.status(400).json({ error: "Valeurs manquants" });
    }

    const db = await getDb();

    // INSERT (sans RETURNING, SQLite ne renvoie pas les données directement)
    const result = await db.run(
      "INSERT INTO event (name, sport, location, date, organizerId) VALUES (?, ?, ?, ?, ?)",
      [name, sport, location ?? "", date ?? "2025-11-13 14:30:00", organizerId]
    );
    if (result) {
      res.json({message: "L'évenement a bien été créé"})
      return
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "L'évenement na pas pu etre créé" });
  }
};

export const GetAllEvent = async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15; 
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM event";
    let params: any[] = [];

    // Si pagination spécifiée
    if (limit > 0) {
      query += " LIMIT ? OFFSET ?";
      params.push(limit, offset);
    }

    const events = await db.all(query, params);

    // Si pagination activée, on renvoie aussi le total
    if (limit > 0) {
      const total = await db.get("SELECT COUNT(*) as count FROM event");
      return res.json({
        page,
        limit,
        total: total.count,
        totalPages: Math.ceil(total.count / limit),
        events,
      });
    }

    // Sinon, on renvoie simplement tous les événements
    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des événements" });
  }
};
