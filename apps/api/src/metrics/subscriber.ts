import { subClient } from "../config/redis.config.js";
import { startCollecting, stopCollecting } from "./collector.js";

export default async function initRedisSubs() {
	subClient.subscribe(`control:${process.env.SERVER_NAME}`, (message) => {
		const data = JSON.parse(message);

		if (data.action === "start-metrics") {
			startCollecting(data.interval);

			console.log(`[${process.env.SERVER_NAME}] metrics started`);
		} else if (data.action === "stop-metrics") {
			stopCollecting();

			console.log(`[${process.env.SERVER_NAME}] metrics stopped`);
		}
	});
}
