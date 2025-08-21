import mongoose from "mongoose";

const connectMongo = async () => {
	const db = mongoose.connection;

	db.on("connected", () => {
		console.log("MongoDB connected successfully.");
	});

	db.on("error", (error) => {
		console.error("MongoDB connection error: ", error);
	});

	db.on("disconnected", () => {
		console.log("MongoDB disconnected.");
	});

	await mongoose.connect(process.env.MONGO_URI as string);
};

export default connectMongo;
