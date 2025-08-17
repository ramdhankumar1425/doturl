import type { IApiError, ErrorType, StatusCodeType } from "types";

export class ApiError extends Error implements IApiError {
	constructor(
		public statusCode: StatusCodeType,
		public errorType: ErrorType,
		message: string
	) {
		super(message);
		this.name = new.target.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
