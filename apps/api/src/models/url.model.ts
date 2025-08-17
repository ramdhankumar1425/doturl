import { Schema, model } from "mongoose";

const urlSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		anonUserId: {
			type: String,
			default: null,
		},
		longUrl: {
			type: String,
			required: true,
			trim: true,
		},
		shortCode: {
			type: String,
			required: true,
			unique: true,
		},
		totalHits: {
			type: Number,
			default: 0,
		},
		expiresAt: {
			type: Date,
			default: null,
		},
		status: {
			type: String,
			enum: ["active", "paused", "expired"],
			default: "active",
		},
	},
	{ timestamps: true }
);

urlSchema.index({ user: 1 });
urlSchema.index({ anonUserId: 1 });

const UrlModel = model("Url", urlSchema);

export default UrlModel;
