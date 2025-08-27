import nodeEmitter from "../config/nodeEmitter.config.js";
import { subClient } from "../config/redis.config.js";
import { IApiMetric } from "types";
import { getIO } from "../sockets/index.js";

export async function initRedisSubs() {
	subClient.subscribe(`metrics`, (message) =>
		onMetricReceived(JSON.parse(message))
	);
}

async function onMetricReceived(metrics: IApiMetric) {
	const io = getIO();
	console.log("Metrics Received:", metrics);

	// send raw to api-metrics:<serverName>
	if (io.sockets.adapter.rooms.get(`api-metrics:${metrics.serverName}`)) {
		io.to(`api-metrics:${metrics.serverName}`).emit("api-metrics", {
			metrics,
		});
	}

	// calculate aggregate for api-metrics:overview
	if (io.sockets.adapter.rooms.get("api-metrics:overview")) {
		io.to("api-metrics:overview").emit("api-metrics", { metrics });
	}
}
