"use client";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check } from "lucide-react";
import CreateNewDialog from "@/components/dashboard/CreateNewDialog";
import DashboardHeader from "@/components/DashboardHeader";
import { useEffect, useState } from "react";
import { IUrl } from "types";
import { sendApiRequest } from "@/services/apiService";

export default function UrlsPage() {
	const [urls, setUrls] = useState<IUrl[]>([]);

	const fetchUrls = async () => {
		try {
			const response = await sendApiRequest("/dashboard/urls", "GET");

			console.log("[UrlsPage] fetchUrls Response:", response);

			if (response.success) {
				const { urls } = response.payload as { urls: IUrl[] };

				setUrls(urls);
			}
		} catch (error) {
			console.log("[UrlsPage] Error in fetching urls:", error);
		}
	};

	useEffect(() => {
		fetchUrls();
	}, []);

	return (
		<div className="min-h-screen flex-1">
			<DashboardHeader
				title="Your links"
				action={<CreateNewDialog />}
			/>
			<div className="mt-10 px-6">
				<div className="px-4 py-2 rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Short URL</TableHead>
								<TableHead>Original URL</TableHead>
								<TableHead>Clicks</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Expiry</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{urls.map((url) => (
								<TableRow key={url._id}>
									<TableCell className="font-medium">
										<a
											href={
												process.env
													.NEXT_PUBLIC_API_BASE_URL +
												`/urls/${url.shortCode}`
											}
											target="_blank"
											rel="noopener noreferrer"
											className="text-white hover:underline"
										>
											{url.shortCode}
										</a>
									</TableCell>
									<TableCell className="max-w-[250px] truncate">
										<a
											href={url.longUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-white hover:underline"
										>
											{url.longUrl}
										</a>
									</TableCell>
									<TableCell>{url.totalHits}</TableCell>
									<TableCell>{url.createdAt}</TableCell>
									<TableCell>
										{url.expiresAt || "Never"}
									</TableCell>
									<TableCell>{url.status}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-48"
											>
												<DropdownMenuItem
													onClick={() =>
														alert(`View ${url._id}`)
													}
												>
													View Analytics
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														alert(`Edit ${url._id}`)
													}
												>
													Edit
												</DropdownMenuItem>

												<DropdownMenuSub>
													<DropdownMenuSubTrigger>
														Change Status
													</DropdownMenuSubTrigger>
													<DropdownMenuSubContent>
														{[
															"Active",
															"Paused",
															"Expired",
														].map((status) => (
															<DropdownMenuItem
																key={status}
																onClick={() =>
																	alert(
																		`Status of ${url._id} set to ${status}`
																	)
																}
															>
																<div className="flex items-center justify-between w-full">
																	<span>
																		{status}
																	</span>
																	{url.status ===
																		status && (
																		<Check className="h-4 w-4 text-green-500" />
																	)}
																</div>
															</DropdownMenuItem>
														))}
													</DropdownMenuSubContent>
												</DropdownMenuSub>
												<DropdownMenuSub>
													<DropdownMenuSubTrigger>
														Change Expiry
													</DropdownMenuSubTrigger>
													<DropdownMenuSubContent>
														<DropdownMenuItem
															onClick={() =>
																alert(
																	`Change expiry for ${url._id}`
																)
															}
														>
															Set New Expiry Date
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuSub>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="text-red-600"
													onClick={() =>
														alert(
															`Delete ${url._id}`
														)
													}
												>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
