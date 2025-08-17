import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		provider: {
			type: String,
			enum: ["google", "github"],
		},
		providerId: {
			type: String,
			unique: true, // Important for deduplication
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			select: false,
		},
		name: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

const UserModel = model("User", userSchema);

export default UserModel;
