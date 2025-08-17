import { Server } from "http";
import { Server as SocketServer } from "socket.io";

export let io: SocketServer | undefined = undefined;

export const initSocketServer = (server: Server) => {
	io = new SocketServer(server);

	io.on("connection", () => {});
};

if (io) {
}
