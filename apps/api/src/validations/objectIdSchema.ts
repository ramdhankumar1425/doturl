import mongoose from "mongoose";
import { z as zod } from "zod";

const objectIdSchema = zod
	.string()
	.trim()
	.refine((val) => mongoose.Types.ObjectId.isValid(val), {
		message: "Invalid ObjectId.",
	});

export default objectIdSchema;
