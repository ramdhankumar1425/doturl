"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { sendApiRequest } from "@/services/apiService";
import { IUrl } from "types";

export default function CreateNewDialog() {
	const [longUrl, setLongUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (!longUrl.trim()) {
			setError("Please enter a valid URL");
			return;
		}
		setLoading(true);

		try {
			const response = await sendApiRequest("/urls", "POST", { longUrl });

			console.log("[CreateNewDialog] createShortUrl Response:", response);

			if (response.success) {
				const { url } = response.payload as { url: IUrl };

				router.push(`/dashboard/urls/${url._id}`);
			} else {
				setError(response.message);
			}
		} catch (error) {
			console.log(
				"[CreateNewDialog] Error in creating new short url:",
				error
			);
			setError("Something went wrong.");
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="default"
					className="cursor-pointer"
				>
					<CirclePlus /> Create new
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Short URL</DialogTitle>
						<DialogDescription>
							Enter your long URL below and we’ll shorten it for
							you.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 mt-4">
						<div className="grid gap-2">
							<Label htmlFor="longUrl">Long URL</Label>
							<Input
								id="longUrl"
								name="longUrl"
								value={longUrl}
								onChange={(e) => setLongUrl(e.target.value)}
								placeholder="https://example.com/very/long/link"
							/>
							{error && (
								<span className="text-sm text-red-500">
									{error}
								</span>
							)}
						</div>
					</div>

					<DialogFooter className="mt-4">
						<DialogClose asChild>
							<Button
								variant="outline"
								type="button"
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={loading}
						>
							{loading ? "Shortening..." : "Shorten"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
