import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  DeleteUser,
  getMyProfil,
  getUserProfil,
  UpdateProfil,
} from "../controllers/user.controller";

const router = Router();

router.get('/profil', authenticateToken, getMyProfil);
router.get('/profil/:id', authenticateToken, getUserProfil)
router.delete("/", authenticateToken, DeleteUser);
router.put("/", authenticateToken, UpdateProfil);


export default router;
