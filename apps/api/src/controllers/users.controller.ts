import { IApiResponse, IAuthTokenPayload, IUser } from "types";
import { UserModel } from "../models/index.js";

import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { ApiError } from "../utils/errors/ApiError.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";

export const getMe = asyncHandler(async (req, res) => {
	const { sub }: IAuthTokenPayload = res.locals.authTokenPayload;

	const user = await UserModel.findById(sub);
	if (!user) throw new ApiError(404, "NOT_FOUND", "User not found.");

	const { _id, email, name, avatar, provider } = user;

	const response: IApiResponse<{
		me: IUser;
	}> = {
		success: true,
		message: "Fetched me.",
		payload: {
			me: {
				_id: _id.toString(),
				email,
				name,
				avatar,
				provider,
			},
		},
	};

	sendApiResponse(res, 200, response);
});
