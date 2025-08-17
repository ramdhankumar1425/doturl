import os from "os";
import { RequestHandler } from "express";
import colors from "colors";
import { IUserAgent } from "types";

export const logger: RequestHandler = (req, res, next) => {
	const userAgent: IUserAgent = res.locals.userAgent;

	const timestamp = new Date().toLocaleString("en-in", {
		dateStyle: "medium",
		timeStyle: "short",
	});
	const method = req.method;
	const path = req.originalUrl;

	// ip
	const ip = req.socket.remoteAddress;

	// System information
	const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB";
	const freeMemory = (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB";

	// User-Agent device
	const device = userAgent.device || "Unknown";

	console.log(
		colors.yellow(`\n[${timestamp}]`) +
			" " +
			colors.cyan.bold(method) +
			" " +
			colors.yellow(path) +
			"\n" +
			colors.white(`IP:       `) +
			colors.magenta(ip || "Undefined") +
			"\n" +
			colors.white(`Memory:   `) +
			colors.cyan(`${freeMemory}/${totalMemory}`) +
			"\n" +
			colors.white(`Device:   `) +
			colors.green(device)
	);

	next();
};
