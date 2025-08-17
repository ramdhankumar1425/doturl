import { rateLimit } from "express-rate-limit";
import { IRateLimitOptions, IApiResponse } from "types";

const addRateLimit = ({
	windowMs,
	limit,
	statusCode,
	message,
}: IRateLimitOptions) =>
	rateLimit({
		windowMs,
		limit,
		statusCode: statusCode || 429,
		message: message || "Too many requests. Please try again later.",
		standardHeaders: "draft-8",
		legacyHeaders: false,
	});

export const authRateLimiter = () => {
	const response: IApiResponse = {
		success: false,
		message: "Too many requests. Please try again later.",
		errorType: "TOO_MANY_REQUESTS",
	};

	return addRateLimit({
		windowMs: 5 * 60 * 1000, // 5min
		limit: 50,
		statusCode: 429,
		message: response,
	});
};
