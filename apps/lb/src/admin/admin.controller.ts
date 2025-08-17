import { IApiResponse } from "types";
import { ServerModel } from "../models/index.js";

import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";
import { ApiError } from "../utils/errors/ApiError.js";

export const getAllServers = asyncHandler(async (req, res) => {
	const servers = await ServerModel.find();

	const response: IApiResponse<{
		servers: {
			_id: string;
			name: string;
			url: string;
			status: "online" | "offline" | "maintenance";
			healthy: boolean;
			cpuCores: number;
			ramGB: number;
		}[];
	}> = {
		success: true,
		message: "Fetched all servers.",
		payload: {
			servers: servers.map((s) => ({
				_id: s._id.toString(),
				name: s.name,
				url: s.url,
				status: s.status,
				healthy: s.healthy,
				cpuCores: s.cpuCores,
				ramGB: s.ramGB,
			})),
		},
	};

	sendApiResponse(res, 200, response);
});

export const addServer = asyncHandler(async (req, res) => {
	const { name, url, status, healthy, cpuCores, ramGB } = req.body as {
		name: string;
		url: string;
		status: "online" | "offline" | "maintenance";
		healthy: boolean;
		cpuCores: number;
		ramGB: number;
	};

	await ServerModel.create([
		{
			name,
			url,
			status,
			healthy,
			cpuCores,
			ramGB,
		},
	]);

	const response: IApiResponse<{ server: any }> = {
		success: true,
		message: "Server added.",
		payload: {
			server: {
				name,
				url,
				status,
				healthy,
				cpuCores,
				ramGB,
			},
		},
	};

	sendApiResponse(res, 201, response);
});

export const updateServer = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const body = req.body;

	const server = await ServerModel.findById(id);
	if (!server) throw new ApiError(404, "NOT_FOUND", "Server not found.");

	const allowedFields = [
		"name",
		"url",
		"status",
		"healthy",
		"cpuCores",
		"ramGB",
	];

	for (const key of allowedFields) {
		if (key in body) {
			(server as any)[key] = (body as any)[key];
		}
	}

	await server.save();

	const response: IApiResponse = {
		success: true,
		message: "Server updated.",
	};

	sendApiResponse(res, 200, response);
});

export const removeServer = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const server = await ServerModel.findById(id);
	if (!server) throw new ApiError(404, "NOT_FOUND", "Server not found.");

	// delete the server
	await server.deleteOne();

	const response: IApiResponse = {
		success: true,
		message: "Server removed.",
	};

	sendApiResponse(res, 200, response);
});
