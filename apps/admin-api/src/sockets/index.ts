import http from "http";
import { Server as SocketServer } from "socket.io";
import registerEvents from "./events.js";

const io = new SocketServer({
	cors: {
		origin: process.env.CLIENT_URI,
	},
});

export function initSocket(httpServer: http.Server) {
	io.attach(httpServer);

	console.log("[Socket] Server initialized...");

	registerEvents(io);
}

export function getIO(): SocketServer {
	return io;
}
