import type { Metadata } from "next";
import { Geist, Geist_Mono, Kalam, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import AuthLoader from "@/components/AuthLoader";
import { headers } from "next/headers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const kalam = Kalam({
	variable: "--font-kalam",
	weight: "700",
	subsets: ["latin"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Doturl — Simple & Fast URL Shortener",
	description:
		"Doturl helps you shorten long links into clean, shareable URLs. Track analytics, manage links, and make your URLs smarter.",
	keywords: [
		"URL shortener",
		"link shortener",
		"custom short links",
		"analytics",
		"Doturl",
	],
	authors: [{ name: "Doturl Team" }],
	openGraph: {
		title: "Doturl — Simple & Fast URL Shortener",
		description:
			"Shorten, share, and track your links easily with Doturl. Clean URLs with analytics.",
		url: "https://doturl.tech",
		siteName: "Doturl",
		locale: "en_IN",
		type: "website",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// this runs on the server
	const hdrs = await headers();
	const noAuth = hdrs.get("x-no-auth") === "true";

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} ${inter.variable} antialiased dark font-inter`}
			>
				<AuthLoader noAuth={noAuth}>{children}</AuthLoader>
				<Analytics />
			</body>
		</html>
	);
}
