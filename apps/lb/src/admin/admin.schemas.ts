import mongoose from "mongoose";
import { z as zod } from "zod";

const objectIdSchema = zod
	.string()
	.trim()
	.refine((val) => mongoose.Types.ObjectId.isValid(val), {
		message: "Invalid ObjectId.",
	});

export const addServerSchema = zod.object({
	name: zod.string({ message: "Server name must be a valid string." }),
	url: zod
		.string({ message: "Server URL must be a valid string." })
		.url({ message: "Server URL must be valid." }),
	status: zod.enum(["online", "offline", "maintenance"], {
		message: "Server status should be valid.",
	}),
	healthy: zod.boolean({ message: "healthy must be boolean." }),
	cpuCores: zod
		.number({ message: "cpuCores must be a valid number." })
		.min(1, { message: "Server can't have less than 1 cpuCores." }),
	ramGB: zod
		.number({ message: "ramGB must be a valid number." })
		.min(0, { message: "ramGB can't be negative." }),
});

export const updateServerSchema = {
	params: zod.object({ id: objectIdSchema }),
	body: zod.object({
		name: zod
			.string({ message: "Server name must be a valid string." })
			.optional(),
		url: zod
			.string({ message: "Server URL must be a valid string." })
			.url("Server URL must be valid.")
			.optional(),
		status: zod
			.enum(["online", "offline", "maintenance"], {
				message: "Server status should be valid.",
			})
			.optional(),
		healthy: zod
			.boolean({ message: "healthy must be boolean." })
			.optional(),
		cpuCores: zod
			.number({ message: "cpuCores must be a valid number." })
			.min(1, { message: "Server can't have less than 1 cpuCores." })
			.optional(),
		ramGB: zod
			.number({ message: "ramGB must be a valid number." })
			.min(0, { message: "ramGB can't be negative." })
			.optional(),
	}),
};

export const removeServerSchema = zod.object({
	id: objectIdSchema,
});
