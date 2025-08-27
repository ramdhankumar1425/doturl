import { Router } from "express";
import mongoose from "mongoose";
import { IApiResponse, IApiHealth } from "types";
import ENV from "../config/env.config.js";
import { cacheClient, pubClient, subClient } from "../config/redis.config.js";

import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";
import {
	getCpuUsageSnapshot,
	getSystemUptime,
} from "../utils/resourceUsage.js";

const router = Router();

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const uptime = getSystemUptime();
		const cpuUsage = await getCpuUsageSnapshot();

		// Memory usage
		const memoryUsage = process.memoryUsage();
		const memory = {
			rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
			heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
			heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
		};

		let mongoStatus:
			| "connected"
			| "connecting"
			| "disconnected"
			| "unknown" = "unknown";

		if (mongoose.connection.readyState === 1) mongoStatus = "connected";
		else if (mongoose.connection.readyState === 2)
			mongoStatus = "connecting";
		else mongoStatus = "disconnected";

		const redisStatus = {
			cacheClient: getRedisStatus(cacheClient),
			pubClient: getRedisStatus(pubClient),
			subClient: getRedisStatus(subClient),
		};

		const response: IApiResponse<{
			health: IApiHealth;
		}> = {
			success: true,
			message: "Health check successful.",
			payload: {
				health: {
					name: ENV.SERVER_NAME,
					version: ENV.APP_VERSION,
					uptime,
					memory,
					mongoStatus,
					redisStatus,
				},
			},
		};

		sendApiResponse(res, 200, response);
	})
);

function getRedisStatus(
	client: any
): "disconnected" | "connected" | "connecting" {
	if (!client.isOpen) return "disconnected";
	if (client.isReady) return "connected";
	return "connecting";
}

export default router;
