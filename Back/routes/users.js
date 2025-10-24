import { Router } from "express"; 
import { insertUser } from "../controllers/users.controller.js"; 
import { loginUser } from "../controllers/users.controller.js";
const router = Router();

router.post("/inserUser",insertUser);
router.post("/login",loginUser);

export default router;