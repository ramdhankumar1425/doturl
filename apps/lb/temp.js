// hit.mjs
const URL = "http://localhost:3000";
const TOTAL = 100;

async function run() {
	for (let i = 1; i <= TOTAL; i++) {
		const start = Date.now();
		try {
			const res = await fetch(URL);
			const ms = Date.now() - start;

			console.log(
				`[${i}] ${new Date().toISOString()} → ${URL} | ${res.status} ${
					res.statusText
				} | ${ms}ms`
			);
		} catch (err) {
			console.error(
				`[${i}] ${new Date().toISOString()} → ${URL} | ERROR: ${
					err.message
				}`
			);
		}
	}
}

run();
