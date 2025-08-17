import { z as zod } from "zod";

export const shortUrlSchema = {
	body: zod.object({
		longUrl: zod
			.string({ message: "longUrl must be a valid string." })
			.url("longUrl must be a valid URL."),
	}),
};

export const redirectSchema = {
	params: zod.object({
		shortCode: zod.string({ message: "shortCode must be a valid string." }),
	}),
};
