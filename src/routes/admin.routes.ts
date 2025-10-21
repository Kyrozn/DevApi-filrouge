import { Router } from "express";
import { setMod } from "../controllers/admin.controller";
import {AdminToken} from "../middleware/admin.middleware"
const router = Router();

router.put("/setMod", AdminToken, setMod);

export default router;
