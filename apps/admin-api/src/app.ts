import express from "express";
import prisma from "./prisma.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("OK!");
});

app.post("/servers", async (req, res) => {
	const { name, url, apiVersion, status, healthy, cpuCores, ramGB, region } =
		req.body;

	await prisma.server.create({
		data: {
			name,
			url,
			apiVersion,
			status,
			healthy,
			cpuCores,
			ramGB,
			region,
		},
	});
});

export default app;
