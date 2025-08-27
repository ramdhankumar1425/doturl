import { refreshServers } from "../services/serversService.js";

export async function initServerRefresh() {
	// load on boot
	await refreshServers();

	const interval =
		Number(process.env.SERVERS_CACHE_REFRESH_INTERVAL_MS) || 10 * 60 * 1000;

	setInterval(() => {
		refreshServers()
			.then(() => {
				console.log("Servers refreshed successfully...");
			})
			.catch((err) => {
				console.error("Failed to refresh servers", err);
			});
	}, interval);
}
