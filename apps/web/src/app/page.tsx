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

			<div className="min-h-screen flex flex-col items-center justify-center">
				<div className="-mt-10 flex-col items-center justify-center font-inter select-none">
					<p className="text-center text-5xl font-semibold">
						From looooong urls to short
					</p>
					<br />
					<p className="text-center text-5xl font-kalam">
						with{" "}
						<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
							.Url
						</span>
					</p>
				</div>

				<div className="mt-10 relative h-16 rounded-4xl outline-4 w-1/2 mx-auto">
					<input
						type="text"
						className="h-full w-9/12 rounded-4xl focus:outline-0 pl-16 text-lg"
						placeholder="Enter your link here"
						value={longUrl}
						onChange={(e) => setLongUrl(e.target.value)}
					/>
					<div className="absolute top-1/2 -translate-y-1/2 ml-6">
						<LinkIcon
							size={24}
							color="#e5e5e5"
						/>
					</div>
					<Button
						disabled={isLoading}
						className="absolute top-[3px] right-[3px] h-11/12 rounded-4xl cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
						onClick={handleShorten}
					>
						{isLoading ? (
							<p className="text-lg px-4 font-normal text-neutral-200">
								Loading...
							</p>
						) : (
							<p className="text-lg px-4 font-normal text-neutral-200">
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
					<div className="mt-6 w-1/2 mx-auto space-y-2">
						<p className="text-center text-sm text-neutral-400">
							Here&apos;s your short URL
						</p>
						<div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3">
							<a
								href={shortUrl}
								target="_blank"
							>
								<p className="truncate text-neutral-200 text-sm">
									{shortUrl.replace(
										/^https?:\/\/(www\.)?/,
										""
									)}
								</p>
							</a>
							<Button
								variant="ghost"
								size="sm"
								className="text-blue-500 hover:text-blue-600 hover:bg-neutral-800 cursor-pointer"
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

				<div className="mt-6 flex items-center justify-center space-x-2">
					<Switch
						id="auto-clipboard-paste"
						checked={canAutoPaste}
						onCheckedChange={(c) => setCanAutoPaste(c)}
					/>
					<Label
						htmlFor="auto-clipboard-paste"
						className="font-normal"
					>
						Auto Paste from Clipboard
					</Label>
				</div>

				<div className="mt-8 flex justify-center items-center space-x-2">
					<p className="text-center font-light">
						You can create{" "}
						<span className="font-semibold text-orange-600">
							05
						</span>{" "}
						more links. Register now to enjoy unlimited usage.
					</p>
					<CircleQuestionMark
						size={20}
						className="text-neutral-200 hover:text-neutral-400 duration-150 cursor-pointer"
					/>
				</div>
			</div>

			{/* <div className="h-40 w-full"></div> */}
			<Footer />
		</div>
	);
}
