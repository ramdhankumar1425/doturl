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
import { MoreHorizontal, Check, ExternalLink } from "lucide-react";
import CreateNewDialog from "@/components/dashboard/CreateNewDialog";
import DashboardHeader from "@/components/dashboard/Header";
import { useEffect, useState } from "react";
import { IUrl } from "types";
import { sendApiRequest } from "@/services/apiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function UrlsPage() {
	const [urls, setUrls] = useState<IUrl[]>([]);
	const router = useRouter();

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
		<div className="min-h-screen flex-1 mb-40">
			<DashboardHeader
				title="Your links"
				action={<CreateNewDialog />}
			/>
			<div className="mt-4 sm:mt-10 px-2 sm:px-6">
				<div className="px-4 py-2 max-w-[100vw] rounded-md border">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-neutral-950">
								<TableHead>Manage</TableHead>
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
								<TableRow
									className="hover:bg-neutral-950"
									key={url._id}
								>
									<TableCell className="w-20">
										<Link
											className="w-10 hover:bg-neutral-900 rounded-lg py-2 aspect-square flex items-center justify-center"
											href={`/dashboard/urls/${url._id}`}
											target="_blank"
										>
											<ExternalLink size={16} />
										</Link>
									</TableCell>

									<TableCell className="font-medium">
										<Link
											href={`/${url.shortCode}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-white hover:underline"
										>
											{url.shortCode}
										</Link>
									</TableCell>
									<TableCell className="max-w-[100px] truncate">
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
									<TableCell>
										<Badge
											variant={
												url.status === "active"
													? "default"
													: url.status === "paused"
													? "secondary"
													: "destructive"
											}
											className="text-xs px-2 py-0"
										>
											{url.status}
										</Badge>
									</TableCell>
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
