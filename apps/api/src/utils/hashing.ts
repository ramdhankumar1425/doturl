import bcrypt from "bcrypt";
import { ApiError } from "./errors/ApiError.js";

export const hash = async (data: string, rounds: number): Promise<string> => {
	try {
		const salt = await bcrypt.genSalt(rounds || 10);
		return bcrypt.hash(data, salt);
	} catch (error) {
		throw new ApiError(
			500,
			"INTERNAL_SERVER_ERROR",
			"Something went wrong."
		);
	}
};

export const compareHash = async (
	data: string,
	hash: string
): Promise<boolean> => {
	try {
		return await bcrypt.compare(data, hash);
	} catch (error) {
		throw new ApiError(
			500,
			"INTERNAL_SERVER_ERROR",
			"Something went wrong."
		);
	}
};
