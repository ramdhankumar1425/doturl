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
import DashboardHeader from "@/components/dashboard/Header";
import { sendApiRequest } from "@/services/apiService";
import { useAuthStore } from "@/stores/useAuthStore";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";

type TimeRange = "30d" | "7d" | "24h";

export default function DashboardPage() {
	const [summary, setSummary] = useState({
		totalUrls: 0,
		totalUniqueVisitors: 0,
		averageDailyClicks: 0,
		clicksLast24Hours: 0,
	});
	const [totalVisitors, setTotalVisitors] = useState<any[]>([]);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [timeRange, setTimeRange] = useState<TimeRange>("7d");
	const [liveMode, setLiveMode] = useState(false);

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
			<div className="mt-6 md:mt-10 mb-6 md:mb-10 px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="p-4 md:p-6">
						<CardTitle className="text-base md:text-lg">
							Total Links
						</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Total links you created
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 md:p-6 md:pt-0">
						<p className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight">
							{summary.totalUrls}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="p-4 md:p-6">
						<CardTitle className="text-base md:text-lg">
							Unique Visitors
						</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Total unique visitors till now
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 md:p-6 md:pt-0">
						<p className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight">
							{summary.totalUniqueVisitors}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="p-4 md:p-6">
						<CardTitle className="text-base md:text-lg">
							Avg. Daily Clicks (7d)
						</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Average clicks per day (last 7 days)
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 md:p-6 md:pt-0">
						<p className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight">
							{summary.averageDailyClicks}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="p-4 md:p-6">
						<CardTitle className="text-base md:text-lg">
							Clicks in Last 24h
						</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Total clicks in the last 24 hours
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-0 md:p-6 md:pt-0">
						<p className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight">
							{summary.clicksLast24Hours}
						</p>
					</CardContent>
				</Card>
			</div>
			{/* Chart */}
			<Card className="mx-4 md:mx-6 mb-10 md:mb-20">
				<CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-neutral-800 px-3 sm:px-4 md:px-6 gap-3">
					<div>
						<CardTitle className="text-lg md:text-xl">
							Total Visitors
						</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Total for the last 3 months
						</CardDescription>
					</div>
					<TimeRangeSelector
						value={timeRange}
						onChange={setTimeRange}
						liveMode={liveMode}
						onLiveModeChange={setLiveMode}
					/>
				</CardHeader>
				<CardContent className="mt-4 md:mt-10 h-60 md:h-80 p-2 md:p-6 focus:outline-none [&_*]:focus:outline-none [&_*]:focus:ring-0">
					<ResponsiveContainer
						width="100%"
						height="100%"
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
								interval="preserveStartEnd"
								tickFormatter={(value) =>
									value.length > 5 ? value.slice(5) : value
								}
								tick={{ fontSize: 10 }}
								tickMargin={5}
							/>

							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#262626"
								vertical={false}
							/>

							<Tooltip
								content={({ active, payload }) =>
									active && payload && payload.length ? (
										<div className="bg-neutral-800 text-white px-2 py-4 rounded-md shadow-md text-xs sm:text-sm">
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
