import { ServerModel } from "../models/index.js";

interface IServer {
	_id: string;
	url: string;
	status: "online" | "offline" | "maintenance";
	healthy: boolean;
	cpuCores: number;
	ramGB: number;
}

export let SERVERS: IServer[] = [];
let currentIndex = 1; // Round-Robin Approach

export const refreshServers = async () => {
	try {
		const servers = await ServerModel.find({
			healthy: true,
			status: "online",
		});

		SERVERS = servers.map((s) => ({
			_id: s._id.toString(),
			url: s.url,
			status: s.status,
			healthy: s.healthy,
			cpuCores: s.cpuCores,
			ramGB: s.ramGB,
		}));
	} catch (error) {
		console.error("Error in refreshServers:", error);
	}
};

export const selectServer = (): IServer => {
	const targetServer = SERVERS[currentIndex % SERVERS.length];

	currentIndex++;

	return targetServer;
};
