import dotenv from "dotenv";
dotenv.config();

const ENV = {
	SERVICE_NAME: process.env.SERVICE_NAME || "url-shotner-api",
	APP_VERSION: process.env.APP_VERSION || "1.0.0",
	LOAD_BALANCER_URI: process.env.LOAD_BALANCER_URI!,
	MONGO_URI: process.env.MONGO_URI!,
	REDIS_URI: process.env.REDIS_URI!,
	CLIENT_URI: process.env.CLIENT_URI!,
	GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID!,
	GOOGLE_WEB_CLIENT_SECRET: process.env.GOOGLE_WEB_CLIENT_SECRET!,
	GOOGLE_WEB_REDIRECT_URI: process.env.GOOGLE_WEB_REDIRECT_URI!,
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
	COOKIE_DOMAIN: process.env.COOKIE_DOMAIN!,
};

// Verify all keys are present
for (const [key, value] of Object.entries(ENV)) {
	if (!value) {
		throw new Error(`Missing environment variable: ${key}`);
	}
}

export default ENV;
