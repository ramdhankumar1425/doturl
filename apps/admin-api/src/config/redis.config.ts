import redis from "redis";

export const pubClient = redis.createClient({ url: process.env.REDIS_URI });
export const subClient = redis.createClient({ url: process.env.REDIS_URI });
