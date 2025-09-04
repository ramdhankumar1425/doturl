import { config } from "dotenv";
config();

import http from "http";

import connectRedis from "./db/connectRedis.js";
import app from "./app.js";
import { logSystemInfo } from "./utils/logs.js";

// connect redis clients
await connectRedis();

const server = http.createServer(app);

const PORT = process.env.PORT || "3000";

server
	.listen({
		port: PORT,
		host: "0.0.0.0",
	})
	.addListener("listening", () => {
		logSystemInfo(PORT);
	});
