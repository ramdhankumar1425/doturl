import crypto from "crypto";
import jwt from "jsonwebtoken";
import { IAuthTokenPayload } from "types";
import ENV from "../config/env.config.js";
import {
	ACCESS_TOKEN_TTL_MS,
	REFRESH_TOKEN_TTL_MS,
} from "../constants/index.js";

export const generateAccessToken = (payload: IAuthTokenPayload): string => {
	return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
		expiresIn: ACCESS_TOKEN_TTL_MS,
	});
};

export const generateRefreshToken = (payload: IAuthTokenPayload): string => {
	return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
		expiresIn: REFRESH_TOKEN_TTL_MS,
	});
};

export const hashRefreshToken = (refreshToken: string): string => {
	return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

export const verifyRefreshToken = (refreshToken: string) => {
	return jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET);
};

export const verifyAccessToken = (accessToken: string) => {
	return jwt.verify(accessToken, ENV.JWT_ACCESS_SECRET);
};

export const generateAnonId = (): string => {
	return "anon_" + crypto.randomBytes(16).toString("hex");
};
