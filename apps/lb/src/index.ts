import { config } from "dotenv";
config();

import http from "http";

import connectDb from "./db/connect.js";
import app from "./app.js";
import { initSocketServer } from "./socket.js";
import { logSystemInfo } from "./utils/logs.js";

// connect db
connectDb();

const server = http.createServer(app);

initSocketServer(server);

const PORT = process.env.PORT || "3000";

server
	.listen({
		port: PORT,
		host: "0.0.0.0",
	})
	.addListener("listening", () => {
		logSystemInfo(PORT);
	});
