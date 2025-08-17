import express, { Router } from "express";
import * as AdminMiddleware from "./admin.middlewares.js";
import * as AdminSchemas from "./admin.schemas.js";
import * as AdminController from "./admin.controller.js";

const router = Router();

router.use(express.json());

router.use(AdminMiddleware.authenticateAdmin);

router.get("/servers", AdminController.getAllServers);

router.post(
	"/servers",
	AdminMiddleware.validateBody(AdminSchemas.addServerSchema),
	AdminController.addServer
);

router.patch(
	"/servers/:id",
	AdminMiddleware.validateParams(AdminSchemas.updateServerSchema.params),
	AdminMiddleware.validateBody(AdminSchemas.updateServerSchema.body),
	AdminController.updateServer
);

router.delete(
	"/servers/:id",
	AdminMiddleware.validateParams(AdminSchemas.removeServerSchema),
	AdminController.removeServer
);

router.use(AdminMiddleware.handleError);

export default router;
