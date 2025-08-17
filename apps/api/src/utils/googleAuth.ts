import ENV from "../config/env.config.js";
import { ApiError } from "./errors/ApiError.js";

interface GoogleUserProfile {
	id: string;
	email: string;
	name: string;
	picture: string;
}

export const getRedirectUrl = (): string => {
	const scope = [
		"https://www.googleapis.com/auth/userinfo.email",
		"https://www.googleapis.com/auth/userinfo.profile",
	];

	const params = new URLSearchParams({
		client_id: ENV.GOOGLE_WEB_CLIENT_ID,
		redirect_uri: ENV.GOOGLE_WEB_REDIRECT_URI,
		response_type: "code",
		scope: scope.join(" "),
		access_type: "offline",
		prompt: "consent",
	});

	const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

	return redirectUrl;
};

export const getUserProfile = async (
	code: string
): Promise<GoogleUserProfile> => {
	const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: ENV.GOOGLE_WEB_CLIENT_ID,
			client_secret: ENV.GOOGLE_WEB_CLIENT_SECRET,
			redirect_uri: ENV.GOOGLE_WEB_REDIRECT_URI,
			grant_type: "authorization_code",
		}),
	});

	const tokenData = await tokenRes.json();

	if (!tokenData.access_token)
		throw new ApiError(400, "BAD_REQUEST", "Failed to get access token.");

	// Fetch user profile
	const profileRes = await fetch(
		"https://www.googleapis.com/oauth2/v2/userinfo",
		{
			headers: { Authorization: `Bearer ${tokenData.access_token}` },
		}
	);

	const profile = await profileRes.json();

	return profile;
};
