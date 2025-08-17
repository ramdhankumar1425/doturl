import { ErrorType, StatusCodeType } from "../unions/index";

export interface IApiResponse<T = undefined> {
	success: boolean;
	message: string;
	payload?: T;
	errorType?: ErrorType;
}

export interface IApiError {
	statusCode: StatusCodeType;
	errorType: ErrorType;
	message: string;
}

export interface IAuthTokenPayload {
	sub: string;
}

export interface IRateLimitOptions {
	windowMs: number;
	limit: number;
	statusCode?: StatusCodeType;
	message?: IApiResponse;
}

export interface IUser {
	_id: string;
	provider?: "google" | "github" | null;
	email: string;
	name: string;
	avatar?: string | null;
}

export interface IUserAgent {
	device?: string;
	browser: {
		name?: string;
		type?: string;
	};
	os: {
		name?: string;
		version?: string;
	};
}

export interface IServiceHealth {
	service: string;
	version: string;
	uptime: number;
	memory: {
		rss: string;
		heapUsed: string;
		heapTotal: string;
	};
	dbStatus: "connected" | "connecting" | "disconnected" | "unknown";
}

export interface IUrl {
	_id: string;
	longUrl: string;
	shortCode: string;
	totalHits: number;
	createdAt: string;
	expiresAt?: string | null;
	status: "active" | "paused" | "expired";
}
