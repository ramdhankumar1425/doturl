"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import {
	TrendingUp,
	Users,
	Globe,
	MousePointer,
	Calendar,
	ExternalLink,
} from "lucide-react";
import {
	mockUrls,
	generateTrafficData,
	mockGeographicData,
} from "@/lib/mock-data";
import { TimeRange } from "@/types";

const COLORS = [
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#6b7280",
];

export default function TrafficAnalyticsPage() {
	const [timeRange, setTimeRange] = useState<TimeRange>("7d");

	const getTrafficData = () => {
		switch (timeRange) {
			case "24h":
				return generateTrafficData(24);
			case "7d":
				return generateTrafficData(7);
			case "30d":
				return generateTrafficData(30);
			default:
				return generateTrafficData(7);
		}
	};

	const trafficData = getTrafficData();
	const totalClicks = trafficData.reduce((sum, day) => sum + day.clicks, 0);
	const totalUniqueClicks = trafficData.reduce(
		(sum, day) => sum + day.uniqueClicks,
		0
	);
	const totalConversions = trafficData.reduce(
		(sum, day) => sum + day.conversions,
		0
	);
	const conversionRate =
		totalClicks > 0
			? ((totalConversions / totalClicks) * 100).toFixed(2)
			: "0";
	const activeUrls = mockUrls.filter((url) => url.isActive).length;
	const topUrls = mockUrls
		.filter((url) => url.isActive)
		.sort((a, b) => b.totalHits - a.totalHits)
		.slice(0, 10);

	const geographicChartData = mockGeographicData.map((item, index) => ({
		...item,
		fill: COLORS[index % COLORS.length],
	}));

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-white">
						Traffic Analytics
					</h1>
					<p className="text-zinc-400 mt-1">
						Monitor and analyze your URL performance
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Select
						value={timeRange}
						onValueChange={(value: TimeRange) =>
							setTimeRange(value)
						}
					>
						<SelectTrigger className="w-40 bg-zinc-900 border-zinc-700">
							<Calendar className="w-4 h-4 mr-2" />
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-zinc-900 border-zinc-700">
							<SelectItem value="24h">Last 24 hours</SelectItem>
							<SelectItem value="7d">Last 7 days</SelectItem>
							<SelectItem value="30d">Last 30 days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Total Clicks
						</CardTitle>
						<MousePointer className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{totalClicks.toLocaleString()}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							<span className="text-green-500">+12.5%</span> from
							last period
						</p>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Unique Visitors
						</CardTitle>
						<Users className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{totalUniqueClicks.toLocaleString()}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							<span className="text-green-500">+8.2%</span> from
							last period
						</p>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Active URLs
						</CardTitle>
						<Globe className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{activeUrls}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							<span className="text-green-500">+5</span> new this
							period
						</p>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Conversion Rate
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{conversionRate}%
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							<span className="text-green-500">+2.1%</span> from
							last period
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Traffic Trend Chart */}
				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader>
						<CardTitle className="text-white">
							Traffic Trend
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Daily clicks and unique visitors over time
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<LineChart data={trafficData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#374151"
								/>
								<XAxis
									dataKey="date"
									stroke="#6b7280"
									fontSize={12}
									tickFormatter={(date) =>
										new Date(date).toLocaleDateString(
											"en-US",
											{ month: "short", day: "numeric" }
										)
									}
								/>
								<YAxis
									stroke="#6b7280"
									fontSize={12}
								/>
								<Line
									type="monotone"
									dataKey="clicks"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={{
										fill: "#3b82f6",
										strokeWidth: 2,
										r: 4,
									}}
									name="Clicks"
								/>
								<Line
									type="monotone"
									dataKey="uniqueClicks"
									stroke="#10b981"
									strokeWidth={2}
									dot={{
										fill: "#10b981",
										strokeWidth: 2,
										r: 4,
									}}
									name="Unique Clicks"
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Geographic Distribution */}
				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader>
						<CardTitle className="text-white">
							Geographic Distribution
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Clicks by country/region
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<PieChart>
								<Pie
									data={geographicChartData}
									cx="50%"
									cy="50%"
									outerRadius={80}
									dataKey="clicks"
									label={({ country, percentage }) =>
										`${country} (${percentage}%)`
									}
								>
									{geographicChartData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.fill}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Top Performing URLs */}
			<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
				<CardHeader>
					<CardTitle className="text-white">
						Top Performing URLs
					</CardTitle>
					<CardDescription className="text-zinc-400">
						Your most clicked shortened URLs
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow className="border-zinc-800">
								<TableHead className="text-zinc-400">
									Short Code
								</TableHead>
								<TableHead className="text-zinc-400">
									Original URL
								</TableHead>
								<TableHead className="text-zinc-400">
									Total Clicks
								</TableHead>
								<TableHead className="text-zinc-400">
									Status
								</TableHead>
								<TableHead className="text-zinc-400">
									Created
								</TableHead>
								<TableHead className="text-zinc-400">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{topUrls.map((url) => (
								<TableRow
									key={url.id}
									className="border-zinc-800"
								>
									<TableCell className="font-mono text-blue-400">
										{url.shortCode}
									</TableCell>
									<TableCell className="text-zinc-300 max-w-xs truncate">
										{url.longUrl}
									</TableCell>
									<TableCell className="text-white font-semibold">
										{url.totalHits.toLocaleString()}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												url.isActive
													? "default"
													: "secondary"
											}
											className={
												url.isActive
													? "bg-green-900 text-green-300"
													: "bg-zinc-800 text-zinc-400"
											}
										>
											{url.isActive
												? "Active"
												: "Inactive"}
										</Badge>
									</TableCell>
									<TableCell className="text-zinc-400">
										{url.createdAt.toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="ghost"
											className="text-zinc-400 hover:text-white"
										>
											<ExternalLink className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
