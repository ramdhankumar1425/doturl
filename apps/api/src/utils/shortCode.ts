import crypto from "crypto";

export const getShortCode = (longUrl: string): string => {
	// hash the longUrl + timeStamp using SHA256
	const timeStamp = Date.now().toString();
	const shaHash = crypto
		.createHash("sha256")
		.update(longUrl + timeStamp)
		.digest("hex");

	// take first 12 hex chars (48 bits)
	let num = parseInt(shaHash.slice(0, 12), 16);

	// convert to base62
	const base62Chars =
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let shortCode = "";

	while (shortCode.length < 8) {
		shortCode += base62Chars[num % 62];
		num = Math.floor(num / 62);
	}

	return shortCode;
};
