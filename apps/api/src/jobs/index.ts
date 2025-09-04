import cron from "cron";
import { batchProcessUrlHits } from "./urlhits.jobs.js";

const jobs: {
	name: string;
	interval: string;
	fn: () => any;
}[] = [
	{
		name: "Batch Process Url Hits",
		interval: "*/10 * * * * *",
		fn: batchProcessUrlHits,
	},
];

export default async function initJobs() {
	console.log(`[Jobs] Initializing ${jobs.length} jobs.`);

	jobs.forEach((job) => {
		cron.CronJob.from({
			name: job.name,
			cronTime: job.interval,
			onTick: job.fn,
			start: true,
			runOnInit: true,
		});
	});

	console.log(`[Jobs] Initialized ${jobs.length} jobs.`);
}
