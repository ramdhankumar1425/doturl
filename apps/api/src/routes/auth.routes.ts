import { Router } from "express";
import { AuthMiddleware } from "../middlewares/index.js";
import { AuthController } from "../controllers/index.js";

const router = Router();

// google
router.get("/google", AuthController.googleRedirect);
router.get("/google/callback", AuthController.googleCallback);

// github
router.get("/github", AuthController.githubRedirect);
router.get("/github/callback", AuthController.githubCallback);

// signup with email + password
router.post("/signup", AuthController.signup);

// login with email + password
router.post("/login", AuthController.login);

// refresh auth with refreshToken
router.post("/refresh", AuthController.refresh);

// logout
router.post("/logout", AuthMiddleware.authenticateUser, AuthController.logout);

export default router;
