import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "../config/db";
import validator from "validator";
import crypto from "crypto";


const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};


export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    if (!validator.isEmail(email))
      return res.status(400).json({ error: "Invalid email" });

    if (password.length < 12)
      return res.status(400).json({
        error: "Password too short (min 12 characters)",
      });

    const db = await getDb();

    const existing = await db.get("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing)
      return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const insert = await db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    const user = await db.get(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [insert.lastID]
    );

    const refreshToken = generateRefreshToken();
    await db.run("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    const token = generateAccessToken(user);

    res.status(201).json({
      user,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const db = await getDb();

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const refreshToken = generateRefreshToken();
    await db.run("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    const token = generateAccessToken(user);

    res.status(200).json({
      token,
      refreshToken,
      info: {
        username: user.username,
        is_premium: user.is_premium,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

// ========== REFRESH TOKEN ==========

export const refresh = async (req: Request, res: Response) => {
  try {
    const { email, refreshToken } = req.body;

    if (!email || !refreshToken)
      return res.status(400).json({ error: "Missing fields" });

    const db = await getDb();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.refresh_token !== refreshToken)
      return res.status(401).json({ error: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);

    // Optionnel : rotation du refresh token
    const newRefreshToken = generateRefreshToken();
    await db.run("UPDATE users SET refresh_token = ? WHERE id = ?", [
      newRefreshToken,
      user.id,
    ]);

    res.status(200).json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};
