import { IApiResponse, IAuthTokenPayload, IUrl, IUserAgent } from "types";
import { UrlModel, UrlHitModel, UserModel } from "../models/index.js";

import { getShortCode } from "../utils/shortCode.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";
import { ApiError } from "../utils/errors/ApiError.js";
import { generateAnonId } from "../utils/tokens.js";
import { withMongoTransaction } from "../utils/transactions.js";

export const shortUrlAnon = asyncHandler(async (req, res) => {
	const { longUrl } = req.body;

	let shortCode: string | null = null;
	let exists: boolean | null = null;

	do {
		shortCode = getShortCode(longUrl);

		exists = await UrlModel.findOne({ shortCode });
	} while (exists);

	// anonId
	let anonId = req.cookies.anonId;
	if (!anonId) {
		anonId = generateAnonId();

		res.cookie("anonId", anonId, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
		});
	}

	// create url
	const [createdUrl] = await UrlModel.create([
		{
			longUrl,
			shortCode,
			anonUserId: anonId,
			expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
		},
	]);

	const response: IApiResponse<{ url: IUrl }> = {
		success: true,
		message: "Generated shortCode.",
		payload: {
			url: {
				_id: createdUrl._id.toString(),
				longUrl,
				shortCode,
				createdAt: createdUrl.createdAt.toISOString().split("T")[0],
				totalHits: createdUrl.totalHits,
				status: createdUrl.status,
				expiresAt: createdUrl.expiresAt
					? createdUrl.expiresAt.toISOString().split("T")[0]
					: null,
			},
		},
	};

	sendApiResponse(res, 201, response);
});

export const shortUrl = asyncHandler(async (req, res) => {
	const { sub }: IAuthTokenPayload = res.locals.authTokenPayload;
	const { longUrl } = req.body;

	const user = await UserModel.findById(sub).lean().select("");
	if (!user) throw new ApiError(404, "NOT_FOUND", "User not found.");

	let shortCode: string | null = null;
	let exists: boolean | null = null;

	do {
		shortCode = getShortCode(longUrl);

		exists = await UrlModel.findOne({ shortCode });
	} while (exists);

	// create url
	const [createdUrl] = await UrlModel.create([
		{
			user: user._id,
			longUrl,
			shortCode,
		},
	]);

	const response: IApiResponse<{ url: IUrl }> = {
		success: true,
		message: "Generated shortCode.",
		payload: {
			url: {
				_id: createdUrl._id.toString(),
				longUrl,
				shortCode,
				createdAt: createdUrl.createdAt.toISOString().split("T")[0],
				totalHits: createdUrl.totalHits,
				status: createdUrl.status,
				expiresAt: createdUrl.expiresAt
					? createdUrl.expiresAt.toISOString().split("T")[0]
					: null,
			},
		},
	};

	sendApiResponse(res, 201, response);
});

export const redirect = asyncHandler(async (req, res) => {
	const { shortCode } = req.params;
	const userAgent: IUserAgent = res.locals.userAgent;

	// find url in db
	const url = await UrlModel.findOne({ shortCode });
	if (!url) throw new ApiError(404, "NOT_FOUND", "Url not found.");

	await withMongoTransaction(async (session) => {
		// update clicks count
		url.totalHits = url.totalHits + 1;
		await url.save();

		// create a url hit
		await UrlHitModel.create([
			{
				url: url._id,
				ipAddress: req.socket.remoteAddress,
				device: userAgent.device,
				os: userAgent.os,
				browser: userAgent.browser,
			},
		]);
	});

	const longUrl = url.longUrl;

	res.redirect(longUrl);
});

export const getAllUrlsAnon = asyncHandler(async (req, res) => {
	let anonId = req.cookies.anonId;

	if (!anonId) {
		anonId = generateAnonId();

		res.cookie("anonId", anonId, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
		});

		const response: IApiResponse<{ urls: any[] }> = {
			success: true,
			message: "You don't have any short urls.",
			payload: {
				urls: [],
			},
		};

		sendApiResponse(res, 200, response);
		return;
	}

	const urls = await UrlModel.find({
		anonUserId: anonId,
	});

	const response: IApiResponse<{
		urls: {
			_id: string;
			longUrl: string;
			shortCode: string;
			totalHits: number;
			createdAt: Date;
			expiresAt: Date;
		}[];
	}> = {
		success: true,
		message: "Fetched all URLs.",
		payload: {
			urls: urls.map(
				({
					_id,
					longUrl,
					shortCode,
					totalHits,
					expiresAt,
					createdAt,
				}) => ({
					_id: _id.toString(),
					longUrl,
					shortCode,
					totalHits,
					createdAt,
					expiresAt,
				})
			),
		},
	};

	sendApiResponse(res, 200, response);
});

export const getAllUrls = asyncHandler(async (req, res) => {
	const { sub }: IAuthTokenPayload = res.locals.authTokenPayload;

	const exists = await UserModel.exists({ _id: sub });
	if (!exists) throw new ApiError(404, "NOT_FOUND", "User not found.");

	const urls = await UrlModel.find({
		user: sub,
	});

	const response: IApiResponse<{
		urls: {
			_id: string;
			longUrl: string;
			shortCode: string;
			totalHits: number;
			createdAt: Date;
			expiresAt: Date;
		}[];
	}> = {
		success: true,
		message: "Fetched all URLs.",
		payload: {
			urls: urls.map(
				({
					_id,
					longUrl,
					shortCode,
					totalHits,
					expiresAt,
					createdAt,
				}) => ({
					_id: _id.toString(),
					longUrl,
					shortCode,
					totalHits,
					createdAt,
					expiresAt,
				})
			),
		},
	};

	sendApiResponse(res, 200, response);
});
