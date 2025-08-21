import redis from "redis";

const redisClient = redis.createClient({ url: process.env.REDIS_URI });

export default redisClient;
