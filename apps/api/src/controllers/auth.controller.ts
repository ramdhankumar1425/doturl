import { IApiResponse, IAuthTokenPayload, IUser } from "types";
import ENV from "../config/env.config.js";
import { UserModel, RefreshTokenModel } from "../models/index.js";

import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { ApiError } from "../utils/errors/ApiError.js";
import {
	generateAccessToken,
	generateRefreshToken,
	hashRefreshToken,
	verifyRefreshToken,
} from "../utils/tokens.js";
import { sendApiResponse } from "../utils/sendApiResponse.js";
import { withMongoTransaction } from "../utils/transactions.js";
import { getRedirectUrl, getUserProfile } from "../utils/googleAuth.js";
import { compareHash, hash } from "../utils/hashing.js";

export const googleRedirect = asyncHandler(async (req, res) => {
	const redirectUrl = getRedirectUrl();

	res.redirect(redirectUrl);
});

export const googleCallback = asyncHandler(async (req, res) => {
	const { code } = req.query as { code: string };
	if (!code) throw new ApiError(400, "BAD_REQUEST", "Missing OAuth code");

	const profile = await getUserProfile(code);

	const data = await withMongoTransaction(async (session) => {
		// find user
		let user = await UserModel.findOne({
			$or: [
				{ provider: "google", providerId: profile.id },
				{
					email: profile.email,
				},
			],
		}).session(session);

		if (user) {
			// if user exists with  different provider, link the accounts
			if (user.provider !== "google" || user.providerId !== profile.id) {
				user.provider = "google";
				user.providerId = profile.id;
				user.avatar = profile.picture;

				await user.save({ session });
			}
		} else {
			// create new user
			const [newUser] = await UserModel.create(
				[
					{
						provider: "google",
						providerId: profile.id,
						email: profile.email,
						name: profile.name,
						avatar: profile.picture,
					},
				],
				{ session }
			);

			user = newUser;
		}

		// generate tokens
		const refreshToken = generateRefreshToken({ sub: user._id.toString() });

		// hash refresh token
		const hashedRefreshToken = hashRefreshToken(refreshToken);

		// delete all the previous tokens associated with this user
		await RefreshTokenModel.deleteMany({ user: user._id });

		// create or update refresh token (Note: Expired tokens already deleted with indexing)
		await RefreshTokenModel.create(
			[
				{
					user: user._id,
					token: hashedRefreshToken,
					expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
				},
			],
			{ session }
		);

		return { refreshToken };
	});

	const { refreshToken } = data;

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
		path: "/",
	});

	res.redirect(`${ENV.CLIENT_URI}/dashboard`);
});

export const githubRedirect = asyncHandler(async (req, res) => {
	throw new ApiError(501, "NOT_IMPLEMENTED", "Not implemented.");
});

export const githubCallback = asyncHandler(async (req, res) => {
	throw new ApiError(501, "NOT_IMPLEMENTED", "Not implemented.");
});

export const signup = asyncHandler(async (req, res) => {
	const { email, password, name } = req.body; // verified using zod

	// check if email already exists
	const exists = await UserModel.findOne({ email });
	if (exists)
		throw new ApiError(
			409,
			"CONFLICT",
			"Email is already associated with other account."
		);

	// hash the password
	const hashedPassword = await hash(password, 10);

	// create a new user
	const [user] = await UserModel.create([
		{
			email,
			password: hashedPassword,
			name,
		},
	]);

	const response: IApiResponse = {
		success: true,
		message: "Signup successful.",
	};

	sendApiResponse(res, 201, response);
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body; // verified using zod

	// check if account exists with email
	const user = await UserModel.findOne({ email });
	if (!user) throw new ApiError(404, "NOT_FOUND", "User not found.");

	// if account exists with a provider ['google', 'github']
	if (user.provider)
		throw new ApiError(
			409,
			"CONFLICT",
			"Email is associated with another account."
		);

	// check for password
	const isCorrect = await compareHash(password, user.password!);
	if (!isCorrect)
		throw new ApiError(400, "BAD_REQUEST", "Invalid credentials.");

	// generate tokens
	const refreshToken = generateRefreshToken({ sub: user._id.toString() });
	const accessToken = generateAccessToken({ sub: user._id.toString() });

	// hash refresh token
	const hashedRefreshToken = hashRefreshToken(refreshToken);

	// delete all the previous tokens associated with this user
	await RefreshTokenModel.deleteMany({ user: user._id });

	// create or update refresh token (Note: Expired tokens already deleted with indexing)
	await RefreshTokenModel.create([
		{
			user: user._id,
			token: hashedRefreshToken,
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
		},
	]);

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
		path: "/",
	});

	const response: IApiResponse<{ accessToken: string }> = {
		success: true,
		message: "Login successful.",
		payload: {
			accessToken,
		},
	};

	sendApiResponse(res, 200, response);
});

export const refresh = asyncHandler(async (req, res) => {
	const { refreshToken } = req.cookies;

	if (!refreshToken)
		throw new ApiError(401, "UNAUTHORIZED", "Invalid credentials.");

	let tokenPayload: IAuthTokenPayload | null = null;
	try {
		tokenPayload = verifyRefreshToken(refreshToken) as IAuthTokenPayload;
	} catch (error: any) {
		if (error.name === "TokenExpiredError")
			throw new ApiError(
				401,
				"REFRESH_TOKEN_EXPIRED",
				"Invalid credentials."
			);
		else
			throw new ApiError(
				401,
				"REFRESH_TOKEN_INVALID",
				"Invalid credentials."
			);
	}

	// hash the token
	const hashedRefreshToken = hashRefreshToken(refreshToken);

	const data = await withMongoTransaction(async (session) => {
		// find the stored token
		const storedToken = await RefreshTokenModel.findOne({
			user: tokenPayload.sub,
			token: hashedRefreshToken,
		}).session(session);

		// Verify token exists, not expired, and not revoked
		if (
			!storedToken ||
			storedToken.expiresAt < new Date()
			// || storedToken.revokedAt
		)
			throw new ApiError(
				401,
				"UNAUTHORIZED",
				"Invalid or expired refresh token."
			);

		// find user
		const user = await UserModel.findById(storedToken.user).session(
			session
		);

		if (!user)
			throw new ApiError(404, "NOT_FOUND", "User no longer exists.");

		// generate new tokens (token rotation)
		const newAccessToken = generateAccessToken({
			sub: user._id.toString(),
		});
		const newRefreshToken = generateRefreshToken({
			sub: user._id.toString(),
		});
		const newHashedRefreshToken = hashRefreshToken(newRefreshToken);

		// revoke old refresh token
		await RefreshTokenModel.updateOne(
			{ _id: storedToken._id },
			{
				revokedAt: new Date(),
				revokedReason: "token_rotation",
			}
		).session(session);

		// create new refresh token
		await RefreshTokenModel.create(
			[
				{
					user: user._id,
					token: newHashedRefreshToken,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
				},
			],
			{ session }
		);

		return { newAccessToken, newRefreshToken, user };
	});

	const { newAccessToken, newRefreshToken, user } = data;

	res.cookie("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
		path: "/",
	});

	const response: IApiResponse<{
		accessToken: string;
		user: IUser;
	}> = {
		success: true,
		message: "Tokens refreshed.",
		payload: {
			accessToken: newAccessToken,
			user: {
				_id: user._id.toString(),
				provider: user.provider,
				email: user.email,
				name: user.name,
				avatar: user.avatar,
			},
		},
	};

	sendApiResponse(res, 200, response);
});

export const logout = asyncHandler(async (req, res) => {
	const { sub }: IAuthTokenPayload = res.locals.authTokenPayload;
	const { refreshToken } = req.cookies;

	if (!refreshToken)
		throw new ApiError(401, "UNAUTHORIZED", "Invalid credentials.");

	// hash the refresh token
	const hashedRefreshToken = hashRefreshToken(refreshToken);

	const storedToken = await RefreshTokenModel.findOne({
		token: hashedRefreshToken,
		user: sub,
	});

	if (!storedToken || storedToken.revokedAt)
		throw new ApiError(401, "UNAUTHORIZED", "Invalid refresh token");

	await storedToken.updateOne({
		revokedAt: new Date(),
		revokedReason: "user_logout",
	});

	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		path: "/",
	});

	const response: IApiResponse = {
		success: true,
		message: "Logged out.",
	};

	sendApiResponse(res, 200, response);
});
