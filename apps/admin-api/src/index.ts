import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { initSocket } from "./sockets/index.js";
import initJobs from "./jobs/index.js";
import connectRedis from "./db/connectRedis.js";
import { initRedisSubs } from "./metrics/subscriber.js";

const server = http.createServer(app);

// init all crons
await initJobs();

// init socket.io server
initSocket(server);

// connect redis
await connectRedis();
// register redis subscribers
initRedisSubs();

const PORT = process.env.PORT || "8081";

server
	.listen({
		port: PORT,
		host: "0.0.0.0",
	})
	.addListener("listening", () => {
		console.log("Admin-Api Started on PORT:", PORT);
	});
