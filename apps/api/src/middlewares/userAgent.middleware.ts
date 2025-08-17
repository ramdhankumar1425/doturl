import { RequestHandler } from "express";
import { UAParser } from "ua-parser-js";
import { IUserAgent } from "types";

import { asyncHandler } from "../utils/errors/asyncHandler.js";

export const parseUserAgent: RequestHandler = asyncHandler(
	async (req, res, next) => {
		const source = req.headers["user-agent"];

		const parser = new UAParser(source);
		const result = parser.getResult();

		const userAgent: IUserAgent = {
			device: result.device.type || "desktop",
			os: result.os,
			browser: result.browser,
		};

		res.locals.userAgent = userAgent;

		next();
	}
);
