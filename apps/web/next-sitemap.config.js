/** @type {import('next-sitemap').IConfig} */

module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.doturl.tech",
	generateRobotsTxt: true,
	exclude: ["/dashboard/urls/*"],
	additionalPaths: async (config) => [
		await config.transform(config, "/"),
		await config.transform(config, "/auth/login"),
		await config.transform(config, "/auth/signup"),
		await config.transform(config, "/dashboard"),
		await config.transform(config, "/dashboard/urls"),
	],
};
