import { IApiResponse, IAuthTokenPayload, IUrl } from "types";
import { UserModel, UrlModel, UrlHitModel } from "../models/index.js";

import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { ApiError } from "../utils/errors/ApiError.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";

export const getSummary = asyncHandler(async (req, res) => {
	// totalUrls, total unique visitors, average daily clicks (last 7 days), clicks in last 24 hours

	const { sub }: IAuthTokenPayload = res.locals.authTokenPayload;

	const exists = await UserModel.exists({ _id: sub });
	if (!exists) throw new ApiError(404, "NOT_FOUND", "User not found.");

	const userUrls = await UrlModel.find({ user: sub }).lean();

	// total urls
	const totalUrls = userUrls.length;

	// total unique visitors
	const userUrlIds = userUrls.map((url) => url._id);

	const totalUniqueVisitors = await UrlHitModel.distinct("ipAddress", {
		url: { $in: userUrlIds },
	});

	// avg clicks in last 7 days
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const totalClicksLast7Days = await UrlHitModel.countDocuments({
		url: { $in: userUrlIds },
		timeStamp: { $gte: sevenDaysAgo },
	});

	const averageDailyClicks = Math.floor(totalClicksLast7Days / 7);

	// total clicks in last 24hours
	const last24Hours = new Date();
	last24Hours.setDate(last24Hours.getDate() - 1);

	const clicksLast24Hours = await UrlHitModel.countDocuments({
		url: { $in: userUrlIds },
		timeStamp: { $gte: last24Hours },
	});

	const response: IApiResponse<{
		summary: {
			totalUrls: number;
			totalUniqueVisitors: number;
			averageDailyClicks: number;
			clicksLast24Hours: number;
		};
	}> = {
		success: true,
		message: "Fetched dashboard summary.",
		payload: {
			summary: {
				totalUrls,
				totalUniqueVisitors: totalUniqueVisitors.length,
				averageDailyClicks,
				clicksLast24Hours,
			},
		},
	};

	sendApiResponse(res, 200, response);
});

export const getTotalVisitors = asyncHandler(async (req, res) => {
	// ?timeRange=24h|7d|30d|90d|all|custom&from=YYYY-MM-DD&to=YYYY-MM-DD
	const { sub }: IAuthTokenPayload = res.locals.authTokenPayload;

	const exists = await UserModel.exists({ _id: sub });
	if (!exists) throw new ApiError(404, "NOT_FOUND", "User not found.");

	const { timeRange, from, to } = res.locals.validatedQuery as {
		timeRange: string;
		from?: string;
		to?: string;
	};

	// fetch user urls
	const userUrls = await UrlModel.find({ user: sub }, { _id: 1 }).lean();
	const userUrlIds = userUrls.map((url) => url._id);

	if (!userUrlIds.length) {
		const response: IApiResponse<{}> = {
			success: true,
			message: "No URLs found.",
			payload: { totalVisitors: [] },
		};
		sendApiResponse(res, 200, response);
		return;
	}

	// determine start and end dates
	let startDate: Date;
	let endDate: Date = new Date();

	switch (timeRange) {
		case "24h":
			startDate = new Date();
			startDate.setDate(endDate.getDate() - 1);
			break;
		case "7d":
			startDate = new Date();
			startDate.setDate(endDate.getDate() - 7);
			break;
		case "30d":
			startDate = new Date();
			startDate.setDate(endDate.getDate() - 30);
			break;
		case "90d":
			startDate = new Date();
			startDate.setDate(endDate.getDate() - 90);
			break;
		case "custom":
			startDate = from ? new Date(from) : new Date();
			endDate = to ? new Date(to) : new Date();
			break;
		default:
			startDate = new Date();
			startDate.setDate(endDate.getDate() - 7);
	}

	// determine grouping format (hour or day)
	let dateFormat: string;
	switch (timeRange) {
		case "24h":
			dateFormat = "%H:00"; // group by hour
			break;
		case "7d":
		case "30d":
		case "90d":
			dateFormat = "%Y-%m-%d"; // group by day
			break;
		case "custom":
			const diffMs = endDate.getTime() - startDate.getTime();
			const diffDays = diffMs / (1000 * 60 * 60 * 24);
			dateFormat = diffDays <= 1 ? "%H:00" : "%Y-%m-%d";
			break;
		default:
			dateFormat = "%Y-%m-%d";
	}

	// aggregate total visitors per time slot
	const visitors = await UrlHitModel.aggregate([
		{
			$match: {
				url: { $in: userUrlIds },
				timeStamp: { $gte: startDate, $lte: endDate },
			},
		},
		{
			$group: {
				_id: {
					$dateToString: { format: dateFormat, date: "$timeStamp" },
				},
				totalVisitors: { $addToSet: "$ipAddress" },
			},
		},
		{
			$project: {
				_id: 0,
				timestamp: "$_id",
				totalVisitors: { $size: "$totalVisitors" },
			},
		},
		{ $sort: { timestamp: 1 } },
	]);

	// fill missing slots with 0
	const filledVisitors: { timestamp: string; totalVisitors: number }[] = [];
	let current = new Date(startDate);

	if (dateFormat === "%H:00") {
		// group by hour
		while (current <= endDate) {
			const ts = current.getHours().toString().padStart(2, "0") + ":00";
			const found = visitors.find((v) => v.timestamp === ts);
			filledVisitors.push({
				timestamp: ts,
				totalVisitors: found ? found.totalVisitors : 0,
			});
			current.setHours(current.getHours() + 1);
		}
	} else {
		// group by day
		while (current <= endDate) {
			const ts = current.toISOString().split("T")[0];
			const found = visitors.find((v) => v.timestamp === ts);
			filledVisitors.push({
				timestamp: ts,
				totalVisitors: found ? found.totalVisitors : 0,
			});
			current.setDate(current.getDate() + 1);
		}
	}

	const response: IApiResponse<{ totalVisitors: any[] }> = {
		success: true,
		message: "Fetched total visitors data.",
		payload: {
			totalVisitors: filledVisitors,
		},
	};

	sendApiResponse(res, 200, response);
});

export const getUrls = asyncHandler(async (req, res) => {
	const { sub }: IAuthTokenPayload = res.locals.authTokenPayload;

	const exists = await UserModel.exists({ _id: sub });
	if (!exists) throw new ApiError(404, "NOT_FOUND", "User not found.");

	const urls = await UrlModel.find({
		user: sub,
	});

	const response: IApiResponse<{
		urls: IUrl[];
	}> = {
		success: true,
		message: "Fetched all urls.",
		payload: {
			urls: urls.map(
				({
					_id,
					longUrl,
					shortCode,
					totalHits,
					createdAt,
					expiresAt,
					status,
				}) => ({
					_id: _id.toString(),
					longUrl,
					shortCode,
					totalHits,
					createdAt: createdAt.toISOString().split("T")[0],
					expiresAt: expiresAt
						? expiresAt.toISOString().split("T")[0]
						: null,
					status,
				})
			),
		},
	};

	sendApiResponse(res, 200, response);
});
