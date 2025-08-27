import mongoose from "mongoose";

const connectMongo = async () => {
	try {
		const db = mongoose.connection;

		db.on("connected", () => {
			console.log("[MongoDB] Connected successfully.");
		});

		db.on("error", (error) => {
			console.error("[MongoDB] Connection error: ", error);
		});

		db.on("disconnected", () => {
			console.log("[MongoDB] Disconnected.");
		});

		await mongoose.connect(process.env.MONGO_URI as string);
	} catch (error) {
		console.error("[MongoDB] Error in connectMongo:", error);
	}
};

export default connectMongo;
