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
		<div className="min-h-screen flex-1 pb-40">
			<DashboardHeader
				title="Your links"
				action={<CreateNewDialog />}
			/>

			{/* Url Info */}
			<Card className="mt-10 mx-6 border-neutral-700 bg-neutral-900 text-white">
				<CardHeader className="flex flex-row items-center justify-between border-b border-neutral-800">
					<CardTitle className="text-lg">URL Info</CardTitle>

					<div className="flex items-center gap-3">
						<Badge
							variant={
								url.status === "Active"
									? "default"
									: url.status === "Paused"
									? "secondary"
									: "destructive"
							}
						>
							{url.status}
						</Badge>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 p-0 text-white hover:bg-neutral-800"
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

				<CardContent className="space-y-6">
					{/* URLs in one row */}
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-1 relative">
							<label className="text-sm text-neutral-400 mb-1 block">
								Short URL
							</label>
							<div className="bg-neutral-800 border border-neutral-700 text-white pr-12 rounded-md px-3 py-2 text-sm w-full block">
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
								className="absolute right-3 top-[34px] text-neutral-400 hover:text-white duration-150 cursor-pointer flex items-center"
							>
								<Copy className="h-4 w-4" />
							</span>
						</div>

						<div className="col-span-2 relative">
							<label className="text-sm text-neutral-400 mb-1 block">
								Long URL
							</label>
							<div className="bg-neutral-800 border border-neutral-700 text-white pr-12 rounded-md px-3 py-2 text-sm w-full block">
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
								className="absolute right-3 top-[34px] text-neutral-400 hover:text-white duration-150 cursor-pointer flex items-center"
							>
								<Copy className="h-4 w-4" />
							</span>
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
							<p className="text-xs text-neutral-400">
								Last Clicked
							</p>
							<p className="text-sm font-medium">
								{url.lastClicked}
							</p>
						</div>
						<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
							<p className="text-xs text-neutral-400">
								Created At
							</p>
							<p className="text-sm font-medium">
								{url.createdAt}
							</p>
						</div>
						<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
							<p className="text-xs text-neutral-400">
								Expires At
							</p>
							<p className="text-sm font-medium">
								{url.expiresAt}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Traffic Analytics */}
			<div className="mt-10 mx-6">
				<TrafficAnalytics />
			</div>
		</div>
	);
}
