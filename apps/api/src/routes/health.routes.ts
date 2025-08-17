import { Router } from "express";
import mongoose from "mongoose";
import { IApiResponse, IServiceHealth } from "types";
import ENV from "../config/env.config.js";

import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";

const router = Router();

router.get(
	"/",
	asyncHandler(async (req, res) => {
		// Uptime
		const uptime = process.uptime(); // seconds

		// Memory usage
		const memoryUsage = process.memoryUsage();
		const memory = {
			rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
			heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
			heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
		};

		let dbStatus: "connected" | "connecting" | "disconnected" | "unknown" =
			"unknown";

		if (mongoose.connection.readyState === 1) dbStatus = "connected";
		else if (mongoose.connection.readyState === 2) dbStatus = "connecting";
		else dbStatus = "disconnected";

		const response: IApiResponse<{
			health: IServiceHealth;
		}> = {
			success: true,
			message: "Health check successful.",
			payload: {
				health: {
					service: ENV.SERVICE_NAME,
					version: ENV.APP_VERSION,
					uptime,
					memory,
					dbStatus,
				},
			},
		};

		sendApiResponse(res, 200, response);
	})
);

export default router;
