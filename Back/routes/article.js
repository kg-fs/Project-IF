import { Router } from "express";  
import { articles } from "../controllers/article.controller.js";
const router = Router();

router.get("/", articles);

export default router;