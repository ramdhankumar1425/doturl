"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { sendApiRequest } from "@/services/apiService";
import { useAuthStore } from "@/stores/useAuthStore";
import { getShortUrl } from "@/utils/shortUrl";
import { CircleQuestionMark, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IUrl } from "types";

export default function Home() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [longUrl, setLongUrl] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [canAutoPaste, setCanAutoPaste] = useState(false);

	const handleShorten = async () => {
		let originalUrl = longUrl;

		if (!originalUrl && canAutoPaste) {
			const val = await navigator.clipboard.readText();
			if (val) {
				setLongUrl(val);
				originalUrl = val;
			}
		}

		if (!originalUrl) return;

		setError("");
		setIsLoading(true);

		try {
			const response = await sendApiRequest(
				`/urls${isAuthenticated ? "" : "/anon"}`,
				"POST",
				{
					longUrl: originalUrl,
				}
			);

			console.log("[HomePage] handleShorten Response:", response);

			if (response.success) {
				const { url } = response.payload as { url: IUrl };
				const shortUrl = getShortUrl(url.shortCode);
				setShortUrl(shortUrl);
			} else {
				setError(response.message);
			}
		} catch (error) {
			console.error("[HomePage] Error in handleShorten:", error);

			setError("Something went wrong. Please try after sometime.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-900">
			<Header />

			<div className="min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="-mt-10 flex-col items-center justify-center font-inter select-none">
					<p className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
						From looooong urls to short
					</p>
					<br />
					<p className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-kalam">
						with{" "}
						<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
							.Url
						</span>
					</p>
				</div>

				<div className="mt-6 sm:mt-8 lg:mt-10 relative h-12 sm:h-14 lg:h-16 rounded-4xl outline-2 sm:outline-4 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
					<input
						type="text"
						className="h-full w-full pr-20 sm:pr-24 md:pr-32 lg:pr-40 rounded-4xl focus:outline-0 pl-10 sm:pl-12 lg:pl-16 text-sm sm:text-base lg:text-lg"
						placeholder="Enter your link here"
						value={longUrl}
						onChange={(e) => setLongUrl(e.target.value)}
					/>
					<div className="absolute top-1/2 -translate-y-1/2 ml-3 sm:ml-4 lg:ml-6">
						<LinkIcon
							size={16}
							className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
							color="#e5e5e5"
						/>
					</div>
					<Button
						disabled={isLoading}
						className="absolute top-[2px] sm:top-[3px] right-[2px] sm:right-[3px] h-[calc(100%-4px)] sm:h-[calc(100%-6px)] rounded-4xl cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed px-1.5 sm:px-2 lg:px-4"
						onClick={handleShorten}
					>
						{isLoading ? (
							<p className="text-xs sm:text-sm lg:text-lg font-normal text-neutral-200">
								Loading...
							</p>
						) : (
							<p className="text-xs sm:text-sm lg:text-lg font-normal text-neutral-200">
								Shorten Now!
							</p>
						)}
					</Button>
				</div>

				{/* Error Section */}
				{error && (
					<p className="mt-4 text-center text-red-500 text-sm font-medium">
						{error}
					</p>
				)}

				{/* Short URL Section */}
				{shortUrl && (
					<div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto space-y-2">
						<p className="text-center text-xs sm:text-sm text-neutral-400">
							Here&apos;s your short URL
						</p>
						<div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-2xl px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3">
							<Link
								href={shortUrl}
								target="_blank"
								className="flex-1 min-w-0"
							>
								<p className="truncate text-neutral-200 text-xs sm:text-sm">
									{shortUrl.replace(
										/^https?:\/\/(www\.)?/,
										""
									)}
								</p>
							</Link>
							<Button
								variant="ghost"
								size="sm"
								className="text-blue-500 hover:text-blue-600 hover:bg-neutral-800 cursor-pointer ml-1 sm:ml-2 flex-shrink-0 text-xs sm:text-sm px-1 sm:px-2 py-1 sm:py-1.5"
								onClick={() =>
									navigator.clipboard.writeText(
										shortUrl.replace(
											/^https?:\/\/(www\.)?/,
											""
										)
									)
								}
							>
								Copy
							</Button>
						</div>
					</div>
				)}

				<div className="mt-4 sm:mt-6 flex items-center justify-center space-x-2">
					<Switch
						id="auto-clipboard-paste"
						checked={canAutoPaste}
						onCheckedChange={(c) => setCanAutoPaste(c)}
					/>
					<Label
						htmlFor="auto-clipboard-paste"
						className="font-normal text-xs sm:text-sm"
					>
						Auto Paste from Clipboard
					</Label>
				</div>
			</div>

			<Footer />
		</div>
	);
}
