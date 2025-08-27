import type { Server } from "socket.io";
import { startMetrics, stopMetrics } from "../metrics/publisher.js";

export default function registerEvents(io: Server) {
	io.on("connection", async (socket) => {
		console.log("[Sockets] New socket connected:", socket.id);

		// turn the api-metrics ON
		await startMetrics();

		socket.on("join:api-metrics:overview", async () => {
			await socket.join("api-metrics:overview");
			console.log(
				`[Sockets] Socket ${socket.id} joined api-metrics:overview`
			);
		});

		socket.on("join:api-metrics", async (serverName: string) => {
			await socket.join(`api-metrics:${serverName}`);
			console.log(
				`[Sockets] Socket ${socket.id} joined api-metrics:${serverName}`
			);
		});

		socket.on("leave:api-metrics:overview", async () => {
			await socket.leave("api-metrics:overview");
			console.log(
				`[Sockets] Socket ${socket.id} left api-metrics:overview`
			);
		});

		socket.on("leave:api-metrics", async (serverName: string) => {
			await socket.leave(`api-metrics:${serverName}`);
			console.log(
				`[Sockets] Socket ${socket.id} left api-metrics:${serverName}`
			);
		});

		socket.on("disconnect", async (reason) => {
			console.log(`Socket disconnected: ${socket.id}`);
			console.log("Disconnect Reason:", reason);

			// turn the api-metrics OFF when no one left
			if (io.engine.clientsCount < 1) {
				await stopMetrics();
			}
		});
	});
}
