import { initServerRefresh } from "./refreshServers.js";

export default async function initJobs() {
	await initServerRefresh();
}
