import { Router } from "express"; 
import { users } from "../controllers/users.controller.js"; 
const router = Router();

router.get("/hola",users);

export default router;