import { Router } from "express";
import { AuthMiddleware, ValidateMiddleware } from "../middlewares/index.js";
import { DashboardSchema } from "../validations/index.js";
import { DashboardController } from "../controllers/index.js";

const router = Router();

router.get(
	"/summary",
	AuthMiddleware.authenticateUser,
	DashboardController.getSummary
);

router.get(
	"/total-visitors",
	AuthMiddleware.authenticateUser,
	ValidateMiddleware.validateQuery(
		DashboardSchema.getTotalVisitorsSchema.query
	),
	DashboardController.getTotalVisitors
);

router.get(
	"/urls",
	AuthMiddleware.authenticateUser,
	DashboardController.getUrls
);

export default router;
