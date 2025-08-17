export const getShortUrl = (shortCode: string): string => {
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

	return `${API_BASE_URL}/urls/${shortCode}`;
};
