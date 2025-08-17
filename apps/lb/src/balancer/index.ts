import { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVERS, selectServer, refreshServers } from "./servers.js";
import { logRedirectInfo } from "../utils/logs.js";

const balancer: RequestHandler = async (req, res, next) => {
	try {
		if (!SERVERS.length) {
			console.warn(
				"Warning: No servers available! Attempting Server Refresh..."
			);

			await refreshServers();

			if (!SERVERS.length) {
				return res.status(503).send("Service Unavailable.");
			}
		}

		const targetServer = selectServer();

		logRedirectInfo(req, targetServer);

		createProxyMiddleware({ target: targetServer.url, changeOrigin: true })(
			req,
			res,
			next
		);
	} catch (error) {
		console.error("[LB] Error:", error);

		return res
			.status(500)
			.json({
				success: false,
				message: "Internal Server Error",
				errorType: "INTERNAL_SERVER_ERROR",
			});
	}
};

export default balancer;
