import { Request, Response } from "express";
import axios from "axios";
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

export async function fetchLeagues(req: Request, res: Response) {
  try {
    const data = await axios.get(`${BASE_URL}/all_leagues.php`);
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur API TheSportsDB" });
  }
}