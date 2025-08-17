import { ZodSchema } from "zod";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors/ApiError.js";
import { IApiResponse } from "types";
import { sendApiResponse } from "../utils/sendApiResponse.js";

export const authenticateAdmin = asyncHandler(async (req, res, next) => {
	// TODO
	next();
});

export const validateBody =
	(schema: ZodSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const message = result.error.issues[0].message || "Invalid body.";
			throw new ApiError(400, "VALIDATION_ERROR", message);
		}

		req.body = result.data;
		next();
	};

export const validateParams =
	(schema: ZodSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.params);

		if (!result.success) {
			const message = result.error.issues[0].message || "Invalid params.";
			throw new ApiError(400, "VALIDATION_ERROR", message);
		}

		req.params = result.data;
		next();
	};

export const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
	console.error(err);

	if (err instanceof ApiError) {
		const response: IApiResponse = {
			success: false,
			message: err.message,
			errorType: err.errorType,
		};

		sendApiResponse(res, err.statusCode, response);
		return;
	}

	const response: IApiResponse = {
		success: false,
		errorType: "INTERNAL_SERVER_ERROR",
		message: "Something went wrong.",
	};

	sendApiResponse(res, 500, response);
};
