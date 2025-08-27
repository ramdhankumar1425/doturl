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
import {
	REDIS_EXP_REFRESH_TOKEN_MAX_MS,
	REFRESH_ROTATE_THRESHOLD_MS,
	REFRESH_TOKEN_TTL_MS,
} from "../constants/index.js";
import getRedisKeys from "../utils/getRedisKeys.js";
import { cacheClient } from "../config/redis.config.js";

export const googleRedirect = asyncHandler(async (req, res) => {
	const redirectUrl = getRedirectUrl();

	res.redirect(redirectUrl);
});

export const googleCallback = asyncHandler(async (req, res) => {
	const { code } = req.query as { code: string };
	if (!code) throw new ApiError(400, "BAD_REQUEST", "Missing OAuth code");

	const profile = await getUserProfile(code);

	// find user in db
	let user = await UserModel.findOne({
		$or: [
			{ provider: "google", providerId: profile.id },
			{
				email: profile.email,
			},
		],
	});

	if (user) {
		// if user exists with  different provider, link the accounts
		if (user.provider !== "google" || user.providerId !== profile.id) {
			user.provider = "google";
			user.providerId = profile.id;
			user.avatar = profile.picture;

			await user.save();
		}
	} else {
		// create new user
		const [newUser] = await UserModel.create([
			{
				provider: "google",
				providerId: profile.id,
				email: profile.email,
				name: profile.name,
				avatar: profile.picture,
			},
		]);

		user = newUser;
	}

	// generate refresh token
	const refreshToken = generateRefreshToken({ sub: user._id.toString() });
	const hashedRefreshToken = hashRefreshToken(refreshToken);

	await withMongoTransaction(async (session) => {
		// revoke all the other tokens that this user had previously
		await RefreshTokenModel.updateMany(
			{ user: user._id },
			{ revokedAt: new Date(), revokedReason: "re_auth" },
			{
				session,
			}
		);

		// create (Note: Expired tokens already deleted with ttl index)
		await RefreshTokenModel.create(
			[
				{
					user: user._id,
					token: hashedRefreshToken,
					expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
				},
			],
			{ session }
		);
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		domain: ENV.COOKIE_DOMAIN,
		expires: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
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
	const start = performance.now();
	const { refreshToken } = req.cookies;
	if (!refreshToken)
		throw new ApiError(401, "UNAUTHORIZED", "Credentials required.");

	// verify JWT
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

	// find in cache or db
	let storedToken: {
		expiresAt: string;
	} | null = null;

	const hashedRefreshToken = hashRefreshToken(refreshToken);

	// check redis cache
	const redisKey = getRedisKeys.authRefresh(
		tokenPayload.sub,
		hashedRefreshToken
	);

	const cached = await cacheClient.get(redisKey);

	if (cached) {
		// cache hit

		storedToken = JSON.parse(cached);
		const end = performance.now();
		console.log("refresh Cache Hit TTE:", end - start);
	} else {
		// cache miss

		// db lookup
		const tokenDoc = await RefreshTokenModel.findOne({
			user: tokenPayload.sub,
			token: hashedRefreshToken,
		});
		if (!tokenDoc)
			throw new ApiError(401, "UNAUTHORIZED", "Invalid credentials.");

		storedToken = {
			expiresAt: tokenDoc.expiresAt.toISOString(),
		};

		// cache it in redis
		const ttl = tokenDoc.expiresAt.getTime() - Date.now();
		if (ttl > 0) {
			await cacheClient.set(redisKey, JSON.stringify(storedToken), {
				expiration: {
					type: "PX",
					value: Math.min(ttl, REDIS_EXP_REFRESH_TOKEN_MAX_MS),
				},
			});
		}

		const end = performance.now();
		console.log("refresh Cache Miss TTE:", end - start);
	}

	// verify expiry
	if (new Date(storedToken!.expiresAt) < new Date()) {
		// NOTE: Expired tokens will be auto deleted from db using ttl index
		// delete from cache
		await cacheClient.del(redisKey);

		throw new ApiError(401, "REFRESH_TOKEN_EXPIRED", "Token expired.");
	}

	// find the user
	const user = await UserModel.findById(tokenPayload.sub);
	if (!user) throw new ApiError(404, "NOT_FOUND", "User no longer exists.");

	// decide rotation
	const expiresAt = new Date(storedToken!.expiresAt);
	const timeLeftMs = expiresAt.getTime() - Date.now();
	const shouldRotate = true;
	// const shouldRotate = timeLeftMs < REFRESH_ROTATE_THRESHOLD_MS;

	if (shouldRotate) {
		// rotate
		const freshRefreshToken = generateRefreshToken({
			sub: user._id.toString(),
		});
		const hashedFreshRefreshToken = hashRefreshToken(freshRefreshToken);
		const freshRefreshTokenExpiresAt = new Date(
			Date.now() + REFRESH_TOKEN_TTL_MS
		);

		await withMongoTransaction(async (session) => {
			// save in db
			await RefreshTokenModel.create(
				[
					{
						user: user._id,
						token: hashedFreshRefreshToken,
						expiresAt: freshRefreshTokenExpiresAt,
					},
				],
				{ session }
			);

			// revoke the old one
			await RefreshTokenModel.updateOne(
				{
					user: user._id,
					token: hashedRefreshToken,
				},
				{
					revokedAt: new Date(),
					revokedReason: "token_rotation",
				},
				{
					session,
				}
			);
		});

		// update redis cache
		await cacheClient.del(redisKey);
		await cacheClient.set(
			getRedisKeys.authRefresh(
				user._id.toString(),
				hashedFreshRefreshToken
			),
			JSON.stringify({
				expiresAt: freshRefreshTokenExpiresAt.toISOString(),
			}),
			{
				expiration: {
					type: "PX",
					value: Math.min(
						freshRefreshTokenExpiresAt.getTime() - Date.now(),
						REDIS_EXP_REFRESH_TOKEN_MAX_MS
					), // 24hrs
				},
			}
		);

		// set-cookie with expiry
		res.cookie("refreshToken", freshRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			domain: ENV.COOKIE_DOMAIN,
			expires: freshRefreshTokenExpiresAt, // align browser with db
		});
	}

	// always issue a fresh accessToken
	const freshAccessToken = generateAccessToken({ sub: user._id.toString() });

	const response: IApiResponse<{
		accessToken: string;
		user: IUser;
	}> = {
		success: true,
		message: shouldRotate
			? "Tokens refreshed (rotated)."
			: "Tokens refreshed.",
		payload: {
			accessToken: freshAccessToken,
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
		secure: true,
		sameSite: "none",
		domain: ENV.COOKIE_DOMAIN,
	});

	const response: IApiResponse = {
		success: true,
		message: "Logged out.",
	};

	sendApiResponse(res, 200, response);
});
