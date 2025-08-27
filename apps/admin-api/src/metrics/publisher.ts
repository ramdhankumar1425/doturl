import { pubClient } from "../config/redis.config.js";
import { getServers } from "../services/serversService.js";

export const startMetrics = async () => {
	try {
		const servers = getServers();

		await Promise.all(
			servers.map(async ({ name }) => {
				const channel = `control:${name}`;
				const payload = JSON.stringify({
					action: "start-metrics",
				});

				const result = await pubClient.publish(channel, payload);
				console.log(
					`[Redis] Published to ${channel}:`,
					payload,
					"Result:",
					result
				);
			})
		);
	} catch (err) {
		console.error(`[Redis] Publish error:`, err);
	}
};

export const stopMetrics = async () => {
	try {
		const servers = getServers();

		await Promise.all(
			servers.map(async ({ name }) => {
				const channel = `control:${name}`;
				const payload = JSON.stringify({
					action: "stop-metrics",
				});

				const result = await pubClient.publish(channel, payload);
				console.log(
					`[Redis] Published to ${channel}:`,
					payload,
					"Result:",
					result
				);
			})
		);
	} catch (err) {
		console.error(`[Redis] Publish error:`, err);
	}
};
