import { queueClient } from "../config/redis.config.js";
import { UrlHitModel } from "../models/index.js";

export const batchProcessUrlHits = async () => {
	console.log("Processing urlhits...");

	const hits = [];
	let item;

	while ((item = await queueClient.lPop("url:hits"))) {
		hits.push(JSON.parse(item));
	}

	if (hits.length > 0) {
		console.log(`Inserting ${hits.length} url hits.`);
		await UrlHitModel.insertMany(hits);
	}
};
