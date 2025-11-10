import { Router } from "express"; 
import * as UsersController from "../controllers/users.controller.js"; 
const router = Router();

router.post("/inserUser",UsersController.insertUser);
router.post("/login",UsersController.loginUser);
router.get("/GetAllUsersWithRoles", UsersController.getAllUsersWithRoles);

export default router;