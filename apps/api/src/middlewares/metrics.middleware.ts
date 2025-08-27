import { recordMetrics } from "../metrics/collector.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";

export const collectMetrics = asyncHandler(async (req, res, next) => {
	const start = process.hrtime.bigint();

	res.on("finish", () => {
		const end = process.hrtime.bigint();

		const durationMs = Number(end - start) / 1_000_000;

		recordMetrics({
			method: req.method,
			url: req.originalUrl,
			statusCode: res.statusCode,
			durationMs,
			timestamp: Date.now(),
		});
	});

	next();
});
