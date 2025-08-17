"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import TimeRangeSelector from "./TimeRangeSelector";

const mockTrafficData = [
	{ time: "00:00", clicks: 5 },
	{ time: "02:00", clicks: 8 },
	{ time: "04:00", clicks: 3 },
	{ time: "06:00", clicks: 12 },
	{ time: "08:00", clicks: 7 },
	{ time: "10:00", clicks: 15 },
	{ time: "12:00", clicks: 10 },
];

export default function TrafficAnalytics() {
	const [liveMode, setLiveMode] = useState(false);

	return (
		<Card className="bg-neutral-900 border-neutral-800 text-white">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Traffic Analytics</CardTitle>
				<TimeRangeSelector />
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent>
							<div className="text-2xl font-bold">100k</div>
							<label className="text-sm text-neutral-400 block">
								Total Clicks
							</label>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<div className="text-2xl font-bold">60k</div>
							<label className="text-sm text-neutral-400 block">
								Unique Visitors
							</label>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<div className="text-2xl font-bold">60%</div>
							<label className="text-sm text-neutral-400 block">
								Unique Rate
							</label>
						</CardContent>
					</Card>
				</div>
				<div className="mt-10 h-64">
					<ResponsiveContainer
						width="100%"
						height="100%"
					>
						<LineChart data={mockTrafficData}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#444"
							/>
							<XAxis
								dataKey="time"
								stroke="#888"
							/>
							<YAxis stroke="#888" />
							<Tooltip
								contentStyle={{
									backgroundColor: "#1f1f1f",
									border: "none",
								}}
								labelStyle={{ color: "#fff" }}
							/>
							<Line
								type="monotone"
								dataKey="clicks"
								stroke="#4ade80"
								strokeWidth={2}
								dot={{ r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
