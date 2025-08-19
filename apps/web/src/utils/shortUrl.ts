export const getShortUrl = (shortCode: string): string => {
	const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

	return `${SITE_URL}/${shortCode}`;
};
