import { config } from "dotenv";
config();

import http from "http";

import app from "./app.js";
import connectMongo from "./db/connectMongo.js";
import connectRedis from "./db/connectRedis.js";
import { logSystemInfo } from "./utils/logs.js";

// connect db
connectMongo();
connectRedis();

const server = http.createServer(app);

const PORT = process.env.PORT || "8000";

server
	.listen({
		port: PORT,
		host: "0.0.0.0",
	})
	.addListener("listening", () => {
		logSystemInfo(PORT);
	});
