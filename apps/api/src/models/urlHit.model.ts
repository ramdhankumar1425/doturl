import { Schema, model } from "mongoose";

const urlHitSchema = new Schema({
	url: {
		type: Schema.Types.ObjectId,
		ref: "Url",
		required: true,
	},
	timeStamp: {
		type: Date,
		default: Date.now,
	},
	ipAddress: {
		type: String,
		trim: true,
	},
	device: {
		type: String,
		default: null,
	},
	browser: {
		name: String,
		type: String,
	},
	os: {
		name: String,
		version: String,
	},
});

urlHitSchema.index({ url: 1, timeStamp: -1 });

const UrlHitModel = model("UrlHit", urlHitSchema);

export default UrlHitModel;
