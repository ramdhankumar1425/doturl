"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimeRangeSelector from "./TimeRangeSelector";
import {
	AreaChart,
	Area,
	XAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

// Sample data - replace with real API data
const data = [
	{ date: "2023-05-01", clicks: 12 },
	{ date: "2023-05-02", clicks: 19 },
	{ date: "2023-05-03", clicks: 7 },
	{ date: "2023-05-04", clicks: 15 },
	{ date: "2023-05-05", clicks: 24 },
	{ date: "2023-05-06", clicks: 32 },
	{ date: "2023-05-07", clicks: 18 },
	{ date: "2023-05-08", clicks: 25 },
	{ date: "2023-05-09", clicks: 21 },
	{ date: "2023-05-10", clicks: 19 },
];

type TimeRange = "30d" | "7d" | "24h";

export default function TrafficAnalytics() {
	const [timeRange, setTimeRange] = useState<TimeRange>("7d");
	const [liveMode, setLiveMode] = useState(false);

	return (
		<Card className="border-neutral-700 bg-neutral-900 text-white">
			<CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 px-3 sm:px-4 md:px-6 gap-3">
				<CardTitle className="text-base sm:text-lg">
					Traffic Analytics
				</CardTitle>
				<TimeRangeSelector
					value={timeRange}
					onChange={setTimeRange}
					liveMode={liveMode}
					onLiveModeChange={setLiveMode}
				/>
			</CardHeader>

			<CardContent className="px-3 sm:px-4 md:px-6">
				{/* Analytics Summary */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
					<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 sm:p-3">
						<p className="text-xs text-neutral-400">Total Clicks</p>
						<p className="text-lg sm:text-xl font-medium">192</p>
					</div>
					<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 sm:p-3">
						<p className="text-xs text-neutral-400">
							Unique Visitors
						</p>
						<p className="text-lg sm:text-xl font-medium">83</p>
					</div>
					<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 sm:p-3">
						<p className="text-xs text-neutral-400">Avg. Daily</p>
						<p className="text-lg sm:text-xl font-medium">14.2</p>
					</div>
					<div className="bg-neutral-800 border border-neutral-700 rounded-lg p-2 sm:p-3">
						<p className="text-xs text-neutral-400">
							Conversion Rate
						</p>
						<p className="text-lg sm:text-xl font-medium">3.4%</p>
					</div>
				</div>

				{/* Chart - with focus outline removal */}
				<div className="h-60 sm:h-72 md:h-80 mt-4 sm:mt-10 md:mt-16 mx-auto max-w-4xl focus:outline-none [&_*]:focus:outline-none [&_*]:focus:ring-0">
					<ResponsiveContainer
						width="100%"
						height="100%"
					>
						<AreaChart
							data={data}
							margin={{
								top: 5,
								right: 10,
								left: 0,
								bottom: 5,
							}}
						>
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
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#262626"
							/>
							<XAxis
								dataKey="date"
								tick={{ fontSize: 10 }}
								tickFormatter={(value) => {
									const date = new Date(value);
									return `${
										date.getMonth() + 1
									}/${date.getDate()}`;
								}}
								style={{ outline: "none" }}
							/>
							<Tooltip
								cursor={{
									stroke: "#666",
									strokeDasharray: "3 3",
									strokeWidth: 1,
								}}
								contentStyle={{ outline: "none" }}
								content={({ active, payload }) =>
									active && payload && payload.length ? (
										<div className="bg-neutral-800 text-white px-2 py-1 rounded-md shadow-md text-xs border border-neutral-700">
											<p>
												{new Date(
													payload[0].payload.date
												).toLocaleDateString()}
											</p>
											<p className="font-medium">
												Clicks: {payload[0].value}
											</p>
										</div>
									) : null
								}
							/>
							<Area
								type="monotone"
								dataKey="clicks"
								stroke="#00C4CC"
								fillOpacity={1}
								fill="url(#colorClicks)"
								style={{ outline: "none" }}
								activeDot={{ r: 6, style: { outline: "none" } }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				{/* Geography Section */}
				<div className="mt-6 max-w-4xl mx-auto">
					<h3 className="text-sm sm:text-base font-medium mb-3">
						Top Locations
					</h3>
					<div className="space-y-2">
						{[
							"United States",
							"Germany",
							"United Kingdom",
							"Canada",
							"France",
						].map((country, index) => (
							<div
								key={country}
								className="flex items-center justify-between text-xs sm:text-sm"
							>
								<span>{country}</span>
								<div className="flex items-center gap-2">
									<div className="w-20 sm:w-32 bg-neutral-800 rounded-full h-2">
										<div
											className="bg-blue-500 h-2 rounded-full"
											style={{
												width: `${80 - index * 15}%`,
											}}
										/>
									</div>
									<span>{80 - index * 15}%</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
