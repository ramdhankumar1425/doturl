import {
	UrlRecord,
	Server,
	TrafficData,
	GeographicData,
	ServerMetric,
	LogEntry,
} from "@/types";

// Generate mock URLs
export const mockUrls: UrlRecord[] = [
	{
		id: "1",
		shortCode: "gh123",
		longUrl: "https://github.com/vercel/next.js",
		totalHits: 15420,
		createdAt: new Date("2024-01-15"),
		lastClickedAt: new Date("2024-01-20"),
		isActive: true,
		tags: ["github", "development"],
	},
	{
		id: "2",
		shortCode: "docs456",
		longUrl: "https://nextjs.org/docs",
		totalHits: 8932,
		createdAt: new Date("2024-01-10"),
		lastClickedAt: new Date("2024-01-19"),
		isActive: true,
		tags: ["documentation"],
	},
	{
		id: "3",
		shortCode: "blog789",
		longUrl: "https://vercel.com/blog/nextjs-14",
		totalHits: 12654,
		createdAt: new Date("2024-01-05"),
		lastClickedAt: new Date("2024-01-18"),
		isActive: true,
		tags: ["blog", "nextjs"],
	},
	{
		id: "4",
		shortCode: "ui101",
		longUrl: "https://ui.shadcn.com",
		totalHits: 9876,
		createdAt: new Date("2024-01-12"),
		lastClickedAt: new Date("2024-01-17"),
		isActive: true,
		tags: ["ui", "components"],
	},
	{
		id: "5",
		shortCode: "api202",
		longUrl: "https://api.example.com/v1/docs",
		totalHits: 3456,
		createdAt: new Date("2024-01-08"),
		lastClickedAt: new Date("2024-01-16"),
		isActive: false,
		tags: ["api", "documentation"],
	},
	// Add more URLs to reach 50+
	...Array.from(
		{ length: 45 },
		(_, i) =>
			({
				id: String(i + 6),
				shortCode: `url${i + 6}`,
				longUrl: `https://example.com/page/${i + 6}`,
				totalHits: Math.floor(Math.random() * 10000) + 100,
				createdAt: new Date(
					2024,
					0,
					Math.floor(Math.random() * 20) + 1
				),
				lastClickedAt: new Date(
					2024,
					0,
					Math.floor(Math.random() * 20) + 1
				),
				isActive: Math.random() > 0.1,
				tags: ["example", "test"],
			} as UrlRecord)
	),
];

// Generate mock servers
export const mockServers: Server[] = [
	{
		id: "1",
		name: "us-east-1-web",
		status: "online",
		ip: "192.168.1.10",
		loadPercentage: 45,
		uptime: 99.9,
		region: "US East",
		version: "2.1.4",
	},
	{
		id: "2",
		name: "us-west-1-web",
		status: "online",
		ip: "192.168.1.11",
		loadPercentage: 62,
		uptime: 99.7,
		region: "US West",
		version: "2.1.4",
	},
	{
		id: "3",
		name: "eu-west-1-web",
		status: "maintenance",
		ip: "192.168.1.12",
		loadPercentage: 0,
		uptime: 98.5,
		region: "EU West",
		version: "2.1.3",
	},
	{
		id: "4",
		name: "ap-south-1-web",
		status: "online",
		ip: "192.168.1.13",
		loadPercentage: 78,
		uptime: 99.8,
		region: "Asia Pacific",
		version: "2.1.4",
	},
	{
		id: "5",
		name: "ca-central-1-web",
		status: "offline",
		ip: "192.168.1.14",
		loadPercentage: 0,
		uptime: 95.2,
		region: "Canada",
		version: "2.1.2",
	},
];

// Generate mock traffic data
export const generateTrafficData = (days: number): TrafficData[] => {
	return Array.from({ length: days }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (days - i - 1));
		return {
			date: date.toISOString().split("T")[0],
			clicks: Math.floor(Math.random() * 1000) + 200,
			uniqueClicks: Math.floor(Math.random() * 800) + 150,
			conversions: Math.floor(Math.random() * 50) + 10,
		};
	});
};

// Mock geographic data
export const mockGeographicData: GeographicData[] = [
	{ country: "United States", clicks: 12500, percentage: 35.2 },
	{ country: "United Kingdom", clicks: 8200, percentage: 23.1 },
	{ country: "Germany", clicks: 5600, percentage: 15.8 },
	{ country: "France", clicks: 3400, percentage: 9.6 },
	{ country: "Canada", clicks: 2800, percentage: 7.9 },
	{ country: "Others", clicks: 2900, percentage: 8.4 },
];

// Generate server metrics
export const generateServerMetrics = (): ServerMetric[] => {
	return Array.from({ length: 24 }, (_, i) => ({
		timestamp: new Date(Date.now() - (23 - i) * 60000).toISOString(),
		cpu: Math.random() * 100,
		memory: Math.random() * 100,
		requests: Math.floor(Math.random() * 1000) + 100,
		responseTime: Math.random() * 500 + 50,
	}));
};

// Generate mock logs
export const generateMockLogs = (): LogEntry[] => {
	const levels: LogEntry["level"][] = ["info", "warning", "error"];
	const messages = [
		"Request processed successfully",
		"Database connection established",
		"Cache miss for key: user_session_123",
		"High memory usage detected",
		"SSL certificate expires in 30 days",
		"Failed to connect to external API",
		"Rate limit exceeded for IP: 192.168.1.100",
		"Backup completed successfully",
		"User authentication failed",
		"Server restarted due to memory leak",
	];

	return Array.from({ length: 100 }, (_, i) => ({
		id: String(i + 1),
		timestamp: new Date(
			Date.now() - Math.random() * 86400000
		).toISOString(),
		level: levels[Math.floor(Math.random() * levels.length)],
		message: messages[Math.floor(Math.random() * messages.length)],
		serverId:
			mockServers[Math.floor(Math.random() * mockServers.length)].id,
		ip:
			Math.random() > 0.5
				? `192.168.1.${Math.floor(Math.random() * 255)}`
				: undefined,
	}));
};
