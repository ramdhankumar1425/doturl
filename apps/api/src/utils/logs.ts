import os from "os";
import colors from "colors";
import ENV from "../config/env.config.js";

export const logSystemInfo = (PORT: string) => {
	// service info
	const serviceName = ENV.SERVICE_NAME;
	const appVersion = ENV.APP_VERSION;

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
	console.log(colors.bold.green(` Server listening on PORT:${PORT}`));
	console.log(
		"\n " +
			colors.blue("Service Info: ") +
			colors.white("Service Name:") +
			" " +
			colors.yellow(serviceName) +
			" " +
			colors.white("App Version:") +
			" " +
			colors.cyan(appVersion)
	);
	console.log(
		" " +
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
