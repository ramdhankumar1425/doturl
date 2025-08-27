import { create } from "zustand";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_CONFIG = {
	TIMEOUT: 10000,
	RECONNECTION_ATTEMPTS: 5,
	RECONNECTION_DELAY: 1000,
	RECONNECTION_DELAY_MAX: 5000,
};

type EmitResponse = {
	success: boolean;
	error?: string;
	data: any;
};

type SocketStore = {
	socket: Socket | null;

	initSocket: () => Promise<void>;
	emit: (event: string, data?: any) => Promise<any>;
	listen: (event: string, cb: (response: any) => void) => any;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
	socket: null,

	initSocket: async () => {
		try {
			const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
				timeout: SOCKET_CONFIG.TIMEOUT,
				reconnection: true,
				reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
				reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
				reconnectionDelayMax: SOCKET_CONFIG.RECONNECTION_DELAY_MAX,
			});

			socketInstance.on("connect_error", (error) => {
				console.error("[SocketStore] connection error:", error);
				toast.error("Error in connecting to server. Please try again.");
			});

			socketInstance.on("disconnect", (reason) => {
				console.warn("Socket disconnected:", reason);
				if (reason === "io server disconnect") {
					// disconnected by server, attempt to reconnect
					toast.info("Connection to server lost. Reconnecting...");
					setTimeout(() => socketInstance.connect(), 5000); // reconnect after 5 seconds
				}
			});

			set({
				socket: socketInstance,
			});
		} catch (error) {
			console.error("[SocketStore] Error in initSocket:", error);
		}
	},
	emit: async (event, data = {}) => {
		const socket = get().socket;
		if (!socket) return;

		return new Promise((resolve, reject) => {
			socket.emit(event, data, (response: EmitResponse) => {
				if (response.success) resolve(response);
				else
					reject(
						new Error(response.error || "Unknown error occured.")
					);
			});
		});
	},
	listen: (event, cb) => {
		const socket = get().socket;
		if (!socket) return;

		const handler = (response: any) => cb(response);

		socket.on(event, handler);

		return () => socket.off(event, handler);
	},
}));
