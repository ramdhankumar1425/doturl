export const ACCESS_TOKEN_EXPIRES_IN = "30m"; // 30 min
export const REFRESH_TOKEN_EXPIRES_IN = "30d"; // 7 days

export const ACCESS_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 min
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const REFRESH_ROTATE_THRESHOLD_MS = 2 * 24 * 60 * 60 * 1000; // rotate when 2 days left
export const REDIS_EXP_REFRESH_TOKEN_MAX_MS = 24 * 60 * 60 * 1000; // max ttl for refresh token rotation cache
