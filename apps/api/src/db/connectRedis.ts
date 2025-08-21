import redisClient from "../config/redis.config.js";

async function connectRedis() {
	try {
		redisClient.on("error", (err) =>
			console.log("Redis Client Error:", err)
		);
		redisClient.on("connect", () =>
			console.log("Initiating connection to the Redis.")
		);
		redisClient.on("ready", () => console.log("Redis is ready."));
		redisClient.on("reconnecting", () =>
			console.log("Redis Client is trying to reconnect to.")
		);

		await redisClient.connect();
	} catch (error) {
		console.error("[connectRedis.ts] Error in connectRedis:", error);
	}
}

export default connectRedis;
