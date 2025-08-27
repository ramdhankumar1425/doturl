import { cacheClient, pubClient, subClient } from "../config/redis.config.js";

async function connectRedis() {
	try {
		const clients = [
			{
				name: "Cache client",
				client: cacheClient,
			},
			{
				name: "Pub client",
				client: pubClient,
			},
			{
				name: "Sub client",
				client: subClient,
			},
		];

		await Promise.all(
			clients.map(async ({ name, client }) => {
				client.on("error", (err) =>
					console.log(`[Redis] ${name} Error:`, err)
				);
				client.on("connect", () =>
					console.log(`[Redis] Initiating connection to ${name}.`)
				);
				client.on("ready", () =>
					console.log(`[Redis] ${name} is ready.`)
				);
				client.on("reconnecting", () =>
					console.log(`[Redis] ${name} is trying to reconnect.`)
				);

				await client.connect();
			})
		);
	} catch (error) {
		console.error("[Redis] Error in connectRedis:", error);
	}
}

export default connectRedis;
