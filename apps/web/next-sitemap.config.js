/** @type {import('next-sitemap').IConfig} */

module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.doturl.tech",
	generateRobotsTxt: true,
	// Remove outDir to use default (public)
	// outDir: "./out",
	exclude: ['/dashboard/urls/*'], // Exclude specific URL pages but include main dashboard
	additionalPaths: async (config) => [
		await config.transform(config, '/'),
		await config.transform(config, '/auth/login'),
		await config.transform(config, '/auth/signup'),
		await config.transform(config, '/dashboard'),
	],
};
