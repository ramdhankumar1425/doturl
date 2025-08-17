import { RequestHandler } from "express";

import { ApiError } from "../utils/errors/ApiError.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const authenticateUser: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new ApiError(
        401,
        "UNAUTHORIZED",
        "Authorization header is missing."
      );

    // header format -> 'Bearer <accessToken>'
    const accessToken = authHeader.split(" ")[1];

    let decoded = null;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error: any) {
      if (error.name === "TokenExpiredError")
        throw new ApiError(401, "ACCESS_TOKEN_EXPIRED", "Invalid credentials.");
      else
        throw new ApiError(401, "ACCESS_TOKEN_INVALID", "Invalid credentials.");
    }

    res.locals.authTokenPayload = decoded;
    next();
  }
);
