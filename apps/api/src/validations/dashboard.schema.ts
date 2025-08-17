import { z as zod } from "zod";

export const getTotalVisitorsSchema = {
	query: zod.object({
		timeRange: zod
			.string()
			.optional()
			.refine(
				(val) =>
					["24h", "7d", "30d", "90d", "all", "custom"].includes(
						val || ""
					),
				{
					message:
						"timeRange must be one of: 24h, 7d, 30d, 90d, all, custom",
				}
			),
		from: zod
			.string()
			.optional()
			.refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
				message: "from must be in YYYY-MM-DD format",
			}),
		to: zod
			.string()
			.optional()
			.refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
				message: "to must be in YYYY-MM-DD format",
			}),
	}),
};
