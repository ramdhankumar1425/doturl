const urlRedirect = (shortCode: string): string => {
	return `url-redirect-${shortCode}`;
};

const authRefresh = (sub: string, hashedToken: string): string => {
	return `auth-refresh-${sub}-${hashedToken}`;
};

const getRedisKeys = {
	urlRedirect,
	authRefresh,
};

export default getRedisKeys;
