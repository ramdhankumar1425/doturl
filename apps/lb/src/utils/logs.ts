import os from "os";
import colors from "colors";
import { Request } from "express";

export const logSystemInfo = (PORT: string) => {
	// System information
	const systemInfo = {
		platform: os.platform(),
		arch: os.arch(),
		cpus: os.cpus().length,
		totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
		freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
		uptime: Math.floor(os.uptime() / 3600) + " hours",
		nodeVersion: process.version,
		pid: process.pid,
	};

	console.log(
		"\n──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────"
	);
	console.log(colors.bold.green(` LB listening on PORT:${PORT}`));
	console.log(
		"\n " +
			colors.blue("System Info: ") +
			colors.magenta(`${systemInfo.platform}/${systemInfo.arch}`) +
			" " +
			colors.white("CPUs:") +
			" " +
			colors.yellow(systemInfo.cpus.toString()) +
			" " +
			colors.white("Memory:") +
			" " +
			colors.cyan(`${systemInfo.freeMemory}/${systemInfo.totalMemory}`) +
			" " +
			colors.white("Uptime:") +
			" " +
			colors.red(systemInfo.uptime) +
			" " +
			colors.white("Node:") +
			" " +
			colors.green(systemInfo.nodeVersion) +
			" " +
			colors.white("PID:") +
			" " +
			colors.yellow(systemInfo.pid.toString())
	);
	console.log(
		"──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────"
	);
};

export const logRedirectInfo = (
	req: Request,
	targetServer: {
		_id: string;
		url: string;
		status: "online" | "offline" | "maintenance";
		healthy: boolean;
		cpuCores: number;
		ramGB: number;
	}
) => {
	const now = new Date().toISOString();

	console.log(
		"\n" +
			colors.blue("Request:") +
			" " +
			colors.magenta(req.method) +
			" " +
			colors.yellow(req.originalUrl) +
			" " +
			colors.white("→ Target:") +
			" " +
			colors.cyan(targetServer.url) +
			" " +
			colors.white("Status:") +
			" " +
			(targetServer.healthy
				? colors.green(targetServer.status)
				: colors.red(targetServer.status)) +
			" " +
			colors.white("CPU Cores:") +
			" " +
			colors.yellow(targetServer.cpuCores.toString()) +
			" " +
			colors.white("RAM:") +
			" " +
			colors.magenta(targetServer.ramGB + "GB") +
			" " +
			colors.white("Timestamp:") +
			" " +
			colors.gray(now)
	);
};
