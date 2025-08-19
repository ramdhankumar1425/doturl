import { CorsOptions } from "cors";
import ENV from "./env.config.js";

const corsConfig: CorsOptions = {
	origin: ENV.CLIENT_URI,
	credentials: true,
};

export default corsConfig;
