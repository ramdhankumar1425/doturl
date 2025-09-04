import { createClient } from "redis";

const url = process.env.REDIS_URI;

export const pubClient = createClient({ url });
export const subClient = createClient({ url });
