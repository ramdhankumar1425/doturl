import { Schema, model } from "mongoose";

const serverSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		url: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["online", "offline", "maintenance"],
			default: "online",
		},
		healthy: {
			type: Boolean,
			default: true,
		},
		cpuCores: {
			type: Number,
			min: 1,
			required: true,
		},
		ramGB: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const ServerModel = model("Server", serverSchema);

export default ServerModel;
