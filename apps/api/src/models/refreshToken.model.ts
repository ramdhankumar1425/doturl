import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
		revokedAt: {
			type: Date,
		},
		revokedReason: {
			type: String,
			enum: ["token_rotation", "re_auth"],
		},
	},
	{
		timestamps: true,
	}
);

// auto cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel = model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
