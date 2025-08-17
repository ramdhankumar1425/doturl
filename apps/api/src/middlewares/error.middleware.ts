import { ErrorRequestHandler } from "express";
import { IApiResponse } from "types";
import { ApiError } from "../utils/errors/ApiError.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";

export const handleApiError: ErrorRequestHandler = (err, _req, res, _next) => {
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
