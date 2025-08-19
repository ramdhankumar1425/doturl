import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: {
		removeConsole: { exclude: ["error"] },
	},
	async rewrites() {
		return [
			{
				source: "/",
				destination: "/",
			},
			{
				source: "/auth/:path*",
				destination: "/auth/:path*",
			},
			{
				source: "/dashboard/:path*",
				destination: "/dashboard/:path*",
			},
			{
				source: "/not-found",
				destination: "/not-found",
			},
			// Other patsh which matches
			{
				source: "/:shortCode([a-zA-Z0-9]{8})",
				destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/urls/:shortCode`,
			},
		];
	},
};

module.exports = nextConfig;

export default nextConfig;
