import { Response } from "express";
import { IApiResponse, StatusCodeType } from "types";

export const sendApiResponse = <T>(
	res: Response,
	statusCode: StatusCodeType,
	apiResponse: IApiResponse<T>
) => {
	res.status(statusCode).json(apiResponse);
};
