import { CorsOptions } from "cors";

const corsConfig: CorsOptions = {
	origin:
		process.env.NODE_ENV === "production"
			? process.env.CLIENT_URI
			: "http://localhost:5000",
	credentials: true,
};

export default corsConfig;
