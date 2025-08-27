import { IApiMetric } from "types";
import { pubClient } from "../config/redis.config.js";

export const publishMetrics = async (metric: IApiMetric) => {
	try {
		await pubClient.publish("metrics", JSON.stringify(metric));

		console.log("Metrics published.");
	} catch (err) {
		console.error("Failed to publish metrics:", err);
	}
};
