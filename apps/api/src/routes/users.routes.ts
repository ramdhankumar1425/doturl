import { Router } from "express";
import { AuthMiddleware } from "../middlewares/index.js";
import { UsersController } from "../controllers/index.js";

const router = Router();

router.get("/me", AuthMiddleware.authenticateUser, UsersController.getMe);

export default router;
