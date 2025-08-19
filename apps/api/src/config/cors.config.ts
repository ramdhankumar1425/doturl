import { CorsOptions } from "cors";
import ENV from "./env.config.js";

const corsConfig: CorsOptions = {
	origin:
		process.env.NODE_ENV === "production"
			? ENV.LOAD_BALANCER_URI
			: [ENV.CLIENT_URI, "http://localhost:3000"],
	credentials: true,
};

export default corsConfig;
