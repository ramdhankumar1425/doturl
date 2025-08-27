import os from "os";

export async function getCpuUsageSnapshot(
	intervalMs: number = 100
): Promise<number> {
	return new Promise((resolve) => {
		const startUsage = process.cpuUsage();
		const startTime = Date.now();

		setTimeout(() => {
			const endUsage = process.cpuUsage(startUsage);
			const elapsed = Date.now() - startTime;

			const totalMS = (endUsage.user + endUsage.system) / 1000;
			const cpuPercent = (totalMS / (elapsed * os.cpus().length)) * 100;

			resolve(cpuPercent);
		}, intervalMs);
	});
}

export function getRamUsageSnapshot(): { usedMb: number; totalMb: number } {
	const totalRamMB = os.totalmem() / 1024 / 1024;
	const usedRamMB = (os.totalmem() - os.freemem()) / 1024 / 1024;

	return {
		usedMb: Number(usedRamMB.toFixed(2)), // in MB
		totalMb: Number(totalRamMB.toFixed(2)), // in MB
	};
}

export function getSystemUptime(): number {
	const uptime = os.uptime() / 3600;

	return Math.round(uptime * 100) / 100;
}
