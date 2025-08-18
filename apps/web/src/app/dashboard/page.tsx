"use client";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AreaChart,
	Area,
	XAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import React, { useEffect, useState } from "react";
import CreateNewDialog from "@/components/dashboard/CreateNewDialog";
import DashboardHeader from "@/components/DashboardHeader";
import { sendApiRequest } from "@/services/apiService";
import { useAuthStore } from "@/stores/useAuthStore";

export default function DashboardPage() {
	const [summary, setSummary] = useState({
		totalUrls: 0,
		totalUniqueVisitors: 0,
		averageDailyClicks: 0,
		clicksLast24Hours: 0,
	});
	const [totalVisitors, setTotalVisitors] = useState<any[]>([]);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const fetchSummary = async () => {
		const response = await sendApiRequest("/dashboard/summary", "GET");

		console.log("[DashboardPage] fetchSummary response:", response);

		if (response.success) {
			setSummary(response.payload.summary);
		}
	};

	const fetchTotalVisitors = async () => {
		const response = await sendApiRequest(
			"/dashboard/total-visitors?timeRange=24h",
			"GET"
		);

		console.log("[DashboardPage] fetchTotalVisitors response:", response);

		if (response.success) {
			const totalVisitors = response.payload.totalVisitors;
			setTotalVisitors(totalVisitors);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchSummary();
			fetchTotalVisitors();
		}
	}, [isAuthenticated]);

	return (
		<div className="min-h-screen flex-1">
			<DashboardHeader
				title="Analytics"
				action={<CreateNewDialog />}
			/>
			{/* Stats Cards */}
			<div className="mt-10 mb-10 px-6 flex items-center justify-between space-x-4">
				<Card className="flex-1">
					<CardHeader>
						<CardTitle>Total Links</CardTitle>
						<CardDescription>
							Total links you created
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="scroll-m-20 pb-1 text-3xl font-semibold tracking-tight">
							{summary.totalUrls}
						</p>
					</CardContent>
				</Card>

				<Card className="flex-1">
					<CardHeader>
						<CardTitle>Unique Visitors</CardTitle>
						<CardDescription>
							Total unique visitors till now
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="scroll-m-20 pb-1 text-3xl font-semibold tracking-tight">
							{summary.totalUniqueVisitors}
						</p>
					</CardContent>
				</Card>

				<Card className="flex-1">
					<CardHeader>
						<CardTitle>Avg. Daily Clicks (7d)</CardTitle>
						<CardDescription>
							Average clicks per day (last 7 days)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="scroll-m-20 pb-1 text-3xl font-semibold tracking-tight">
							{summary.averageDailyClicks}
						</p>
					</CardContent>
				</Card>

				<Card className="flex-1">
					<CardHeader>
						<CardTitle>Clicks in Last 24h</CardTitle>
						<CardDescription>
							Total clicks in the last 24 hours
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="scroll-m-20 pb-1 text-3xl font-semibold tracking-tight">
							{summary.clicksLast24Hours}
						</p>
					</CardContent>
				</Card>
			</div>
			{/* Chart */}
			<Card className="mx-6 mb-20">
				<CardHeader>
					<CardTitle>Total Visitors</CardTitle>
					<CardDescription>
						Total for the last 3 months
					</CardDescription>
					<CardAction>
						<div className="flex border border-neutral-700 rounded-lg overflow-hidden">
							<p className="border-r py-2 pl-4 pr-2 hover:bg-neutral-800 cursor-pointer text-sm font-normal">
								Last 3 months
							</p>
							<p className="border-r py-2 pl-4 pr-2 hover:bg-neutral-800 cursor-pointer text-sm font-normal">
								Last 30 days
							</p>
							<p className="py-2 pr-4 pl-2 hover:bg-neutral-800 cursor-pointer text-sm font-normal">
								Last 7 days
							</p>
						</div>
					</CardAction>
				</CardHeader>
				<CardContent className="mt-10 h-80">
					<ResponsiveContainer
						width="100%"
						height={300}
					>
						<AreaChart data={totalVisitors}>
							<defs>
								<linearGradient
									id="colorClicks"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#00C4CC"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="#00C4CC"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>

							<XAxis
								dataKey="timestamp"
								interval="preserveStartEnd" // avoid squeezing
								tickFormatter={(value) =>
									value.length > 5 ? value.slice(5) : value
								} // shorten if needed
							/>

							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#262626"
								vertical={false}
							/>

							<Tooltip
								content={({ active, payload }) =>
									active && payload && payload.length ? (
										<div className="bg-neutral-800 text-white px-2 py-4 rounded-md shadow-md text-sm">
											Visitors: {payload[0].value}
										</div>
									) : null
								}
							/>

							<Area
								type="monotone"
								dataKey="totalVisitors"
								stroke="#00C4CC"
								fillOpacity={1}
								fill="url(#colorClicks)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
}
