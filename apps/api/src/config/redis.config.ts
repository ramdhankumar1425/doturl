import { config } from "dotenv";
config();

import { createClient } from "redis";

const RedisClient = createClient({ url: process.env.REDIS_URI });

RedisClient.on("error", (err) => console.log("Redis Client Error", err));

await RedisClient.connect();

export default RedisClient;
