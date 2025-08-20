"use client";

import CreateNewDialog from "@/components/dashboard/CreateNewDialog";
import DashboardHeader from "@/components/dashboard/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal } from "lucide-react";
import React from "react";
import TrafficAnalytics from "@/components/dashboard/TrafficAnalytics";
import Link from "next/link";
import { getShortUrl } from "@/utils/shortUrl";

const url = {
	shortCode: "c0eqxme",
	longUrl: "https://ui.shadcn.com/docs/components/data-table",
	status: "Active",
	createdAt: "2025-04-12",
	lastClicked: "2025-05-23",
	expiresAt: "2025-11-30",
	totalClicks: 237,
};

export default function URLDetailsPage() {
	return (
		<div className="min-h-screen flex-1 pb-10 sm:pb-20 md:pb-40">
			<DashboardHeader
				title={getShortUrl(url.shortCode)}
				action={<CreateNewDialog />}
			/>

			{/* Url Info */}
			<Card className="mt-4 sm:mt-6 md:mt-10 mx-2 sm:mx-4 md:mx-6 border-neutral-700 bg-neutral-900 text-white">
				<CardHeader className="flex flex-row items-center justify-between border-b border-neutral-800 px-3 sm:px-4 md:px-6">
					<CardTitle className="text-base sm:text-lg">
						URL Info
					</CardTitle>

					<div className="flex items-center gap-2 sm:gap-3">
						<Badge
							variant={
								url.status === "Active"
									? "default"
									: url.status === "Paused"
									? "secondary"
									: "destructive"
							}
							className="text-xs px-2 py-0"
						>
							{url.status}
						</Badge>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-neutral-800"
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="bg-neutral-900 text-white border-neutral-700"
							>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator className="bg-neutral-700" />
								<DropdownMenuItem>
									Change Status
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500">
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>

				<CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
					{/* URLs in one row */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
						<div className="md:col-span-1 relative">
							<label className="text-xs sm:text-sm text-neutral-400 mb-1 block">
								Short URL
							</label>
							<div className="bg-neutral-800 border border-neutral-700 text-white pr-12 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm w-full block">
								<Link
									href={`/${url.shortCode}`}
									target="_blank"
									className="hover:underline"
								>
									{url.shortCode}
								</Link>
							</div>

							<span
								onClick={() =>
									navigator.clipboard.writeText(
										getShortUrl(url.shortCode)
									)
								}
								className="absolute right-2 sm:right-3 top-[30px] sm:top-[34px] text-neutral-400 hover:text-white duration-150 cursor-pointer flex items-center"
							>
								<Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							</span>
						</div>

						<div className="md:col-span-2 relative">
							<label className="text-xs sm:text-sm text-neutral-400 mb-1 block">
								Long URL
							</label>
							<div className="bg-neutral-800 border border-neutral-700 text-white pr-12 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm w-full block truncate">
								<Link
									href={url.longUrl}
									target="_blank"
									className="hover:underline"
								>
									{url.longUrl}
								</Link>
							</div>
							<span
								onClick={() =>
									navigator.clipboard.writeText(url.longUrl)
								}
								className="absolute right-2 sm:right-3 top-[30px] sm:top-[34px] text-neutral-400 hover:text-white duration-150 cursor-pointer flex items-center"
							>
								<Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							</span>
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
						<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 sm:p-3">
							<p className="text-xs text-neutral-400">
								Last Clicked
							</p>
							<p className="text-xs sm:text-sm font-medium">
								{url.lastClicked}
							</p>
						</div>
						<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 sm:p-3">
							<p className="text-xs text-neutral-400">
								Created At
							</p>
							<p className="text-xs sm:text-sm font-medium">
								{url.createdAt}
							</p>
						</div>
						<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 sm:p-3">
							<p className="text-xs text-neutral-400">
								Expires At
							</p>
							<p className="text-xs sm:text-sm font-medium">
								{url.expiresAt}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Traffic Analytics */}
			<div className="mt-4 sm:mt-6 md:mt-10 mx-2 sm:mx-4 md:mx-6">
				<TrafficAnalytics />
			</div>
		</div>
	);
}
