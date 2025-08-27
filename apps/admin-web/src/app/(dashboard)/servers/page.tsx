"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";
import {
	Server,
	Plus,
	Edit,
	Trash2,
	Activity,
	Cpu,
	MemoryStick,
	Network,
	AlertTriangle,
	CheckCircle,
	XCircle,
	RefreshCw,
	Monitor,
	Clock,
	Search,
	Filter,
	Download,
} from "lucide-react";
import { toast } from "sonner";
import {
	mockServers,
	generateServerMetrics,
	generateMockLogs,
} from "@/lib/mock-data";
import { Server as ServerType, ServerMetric, LogEntry } from "@/types";
import { useSocketStore } from "@/stores/useSocketStore";

export default function ServerMaintenance() {
	const [servers, setServers] = useState<ServerType[]>(mockServers);
	const [metrics, setMetrics] = useState<ServerMetric[]>(
		generateServerMetrics()
	);
	const [logs, setLogs] = useState<LogEntry[]>(generateMockLogs());
	const [selectedServer, setSelectedServer] = useState<string>("all");
	const [logLevel, setLogLevel] = useState<string>("all");
	const [logSearch, setLogSearch] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingServer, setEditingServer] = useState<ServerType | null>(null);
	const [deletingServerId, setDeletingServerId] = useState<string | null>(
		null
	);
	const listen = useSocketStore((state) => state.listen);
	const emit = useSocketStore((state) => state.emit);
	const socket = useSocketStore((state) => state.socket);

	const [newServer, setNewServer] = useState({
		name: "",
		ip: "",
		region: "",
		version: "",
	});

	const [editForm, setEditForm] = useState({
		name: "",
		ip: "",
		region: "",
		version: "",
	});

	// Simulate real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			setMetrics((prev) => {
				const newMetric: ServerMetric = {
					timestamp: new Date().toISOString(),
					cpu: Math.random() * 100,
					memory: Math.random() * 100,
					requests: Math.floor(Math.random() * 1000) + 100,
					responseTime: Math.random() * 500 + 50,
				};
				return [...prev.slice(-23), newMetric];
			});

			// Occasionally add new log entries
			if (Math.random() < 0.3) {
				const logMessages = [
					"Request processed successfully",
					"Database connection established",
					"Cache hit for user session",
					"SSL certificate renewed",
					"Backup completed",
					"Health check passed",
				];

				const levels: LogEntry["level"][] = [
					"info",
					"warning",
					"error",
				];

				const newLog: LogEntry = {
					id: Date.now().toString(),
					timestamp: new Date().toISOString(),
					level: levels[Math.floor(Math.random() * levels.length)],
					message:
						logMessages[
							Math.floor(Math.random() * logMessages.length)
						],
					serverId:
						servers[Math.floor(Math.random() * servers.length)].id,
					ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
				};

				setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [servers]);

	// register metrics listener
	useEffect(() => {
		const init = async () => {
			console.log("Joining....");

			await emit("join:api-metrics:overview");
		};

		const cleanup = listen("api-metrics", (response) => {
			console.log("Metrics Received:", response);
		});

		if (socket && socket.connected) init();

		return cleanup;
	}, [socket?.connected]);

	const filteredLogs = logs.filter((log) => {
		const matchesServer =
			selectedServer === "all" || log.serverId === selectedServer;
		const matchesLevel = logLevel === "all" || log.level === logLevel;
		const matchesSearch =
			logSearch === "" ||
			log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
			log.ip?.toLowerCase().includes(logSearch.toLowerCase());

		return matchesServer && matchesLevel && matchesSearch;
	});

	const onlineServers = servers.filter((s) => s.status === "online").length;
	const avgCpu =
		metrics.length > 0 ? metrics[metrics.length - 1]?.cpu || 0 : 0;
	const avgMemory =
		metrics.length > 0 ? metrics[metrics.length - 1]?.memory || 0 : 0;
	const totalRequests = metrics.reduce((sum, m) => sum + m.requests, 0);

	const handleCreateServer = () => {
		if (
			!newServer.name ||
			!newServer.ip ||
			!newServer.region ||
			!newServer.version
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		const server: ServerType = {
			id: Date.now().toString(),
			name: newServer.name,
			ip: newServer.ip,
			region: newServer.region,
			version: newServer.version,
			status: "online",
			loadPercentage: Math.floor(Math.random() * 50) + 10,
			uptime: 99.5 + Math.random() * 0.5,
		};

		setServers((prev) => [...prev, server]);
		setNewServer({ name: "", ip: "", region: "", version: "" });
		setIsCreateDialogOpen(false);
		toast.success("Server created successfully");
	};

	const handleEditServer = (server: ServerType) => {
		setEditingServer(server);
		setEditForm({
			name: server.name,
			ip: server.ip,
			region: server.region,
			version: server.version,
		});
	};

	const handleUpdateServer = () => {
		if (
			!editingServer ||
			!editForm.name ||
			!editForm.ip ||
			!editForm.region ||
			!editForm.version
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		setServers((prev) =>
			prev.map((server) =>
				server.id === editingServer.id
					? {
							...server,
							name: editForm.name,
							ip: editForm.ip,
							region: editForm.region,
							version: editForm.version,
					  }
					: server
			)
		);

		setEditingServer(null);
		toast.success("Server updated successfully");
	};

	const handleDeleteServer = (id: string) => {
		setServers((prev) => prev.filter((server) => server.id !== id));
		setDeletingServerId(null);
		toast.success("Server deleted successfully");
	};

	const getStatusIcon = (status: ServerType["status"]) => {
		switch (status) {
			case "online":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "offline":
				return <XCircle className="h-4 w-4 text-red-500" />;
			case "maintenance":
				return <AlertTriangle className="h-4 w-4 text-orange-500" />;
			default:
				return <XCircle className="h-4 w-4 text-gray-500" />;
		}
	};

	const getStatusColor = (status: ServerType["status"]) => {
		switch (status) {
			case "online":
				return "bg-green-900 text-green-300";
			case "offline":
				return "bg-red-900 text-red-300";
			case "maintenance":
				return "bg-orange-900 text-orange-300";
			default:
				return "bg-zinc-800 text-zinc-400";
		}
	};

	const getLogLevelColor = (level: LogEntry["level"]) => {
		switch (level) {
			case "info":
				return "bg-blue-900 text-blue-300";
			case "warning":
				return "bg-orange-900 text-orange-300";
			case "error":
				return "bg-red-900 text-red-300";
			default:
				return "bg-zinc-800 text-zinc-400";
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-white">
						Server Maintenance
					</h1>
					<p className="text-zinc-400 mt-1">
						Monitor server health and manage infrastructure
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<Button
						variant="outline"
						className="border-zinc-700 text-zinc-300"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Refresh
					</Button>
					<Dialog
						open={isCreateDialogOpen}
						onOpenChange={setIsCreateDialogOpen}
					>
						<DialogTrigger asChild>
							<Button className="bg-blue-600 hover:bg-blue-700">
								<Plus className="w-4 h-4 mr-2" />
								Add Server
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-zinc-900 border-zinc-800">
							<DialogHeader>
								<DialogTitle className="text-white">
									Add New Server
								</DialogTitle>
								<DialogDescription className="text-zinc-400">
									Register a new server for monitoring
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label
										htmlFor="serverName"
										className="text-zinc-300"
									>
										Server Name
									</Label>
									<Input
										id="serverName"
										value={newServer.name}
										onChange={(e) =>
											setNewServer((prev) => ({
												...prev,
												name: e.target.value,
											}))
										}
										placeholder="e.g., us-east-1-web"
										className="bg-zinc-800 border-zinc-700 text-white"
									/>
								</div>
								<div className="grid gap-2">
									<Label
										htmlFor="serverIp"
										className="text-zinc-300"
									>
										IP Address
									</Label>
									<Input
										id="serverIp"
										value={newServer.ip}
										onChange={(e) =>
											setNewServer((prev) => ({
												...prev,
												ip: e.target.value,
											}))
										}
										placeholder="192.168.1.10"
										className="bg-zinc-800 border-zinc-700 text-white"
									/>
								</div>
								<div className="grid gap-2">
									<Label
										htmlFor="serverRegion"
										className="text-zinc-300"
									>
										Region
									</Label>
									<Input
										id="serverRegion"
										value={newServer.region}
										onChange={(e) =>
											setNewServer((prev) => ({
												...prev,
												region: e.target.value,
											}))
										}
										placeholder="US East"
										className="bg-zinc-800 border-zinc-700 text-white"
									/>
								</div>
								<div className="grid gap-2">
									<Label
										htmlFor="serverVersion"
										className="text-zinc-300"
									>
										Version
									</Label>
									<Input
										id="serverVersion"
										value={newServer.version}
										onChange={(e) =>
											setNewServer((prev) => ({
												...prev,
												version: e.target.value,
											}))
										}
										placeholder="2.1.4"
										className="bg-zinc-800 border-zinc-700 text-white"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setIsCreateDialogOpen(false)}
									className="border-zinc-700 text-zinc-300"
								>
									Cancel
								</Button>
								<Button
									onClick={handleCreateServer}
									className="bg-blue-600 hover:bg-blue-700"
								>
									Add Server
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Online Servers
						</CardTitle>
						<Server className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{onlineServers}/{servers.length}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							{((onlineServers / servers.length) * 100).toFixed(
								1
							)}
							% uptime
						</p>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Avg CPU Usage
						</CardTitle>
						<Cpu className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{avgCpu.toFixed(1)}%
						</div>
						<Progress
							value={avgCpu}
							className="mt-2 h-2"
						/>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Memory Usage
						</CardTitle>
						<MemoryStick className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{avgMemory.toFixed(1)}%
						</div>
						<Progress
							value={avgMemory}
							className="mt-2 h-2"
						/>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Total Requests
						</CardTitle>
						<Network className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{totalRequests.toLocaleString()}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							Last 24 hours
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Real-time Metrics */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader>
						<CardTitle className="text-white">
							System Metrics
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Real-time CPU and memory usage across all servers
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<LineChart data={metrics}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#374151"
								/>
								<XAxis
									dataKey="timestamp"
									stroke="#6b7280"
									fontSize={12}
									tickFormatter={(timestamp) =>
										new Date(timestamp).toLocaleTimeString()
									}
								/>
								<YAxis
									stroke="#6b7280"
									fontSize={12}
								/>
								<Line
									type="monotone"
									dataKey="cpu"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={false}
									name="CPU %"
								/>
								<Line
									type="monotone"
									dataKey="memory"
									stroke="#f59e0b"
									strokeWidth={2}
									dot={false}
									name="Memory %"
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader>
						<CardTitle className="text-white">
							Request Volume
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Incoming requests and response times
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<AreaChart data={metrics}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#374151"
								/>
								<XAxis
									dataKey="timestamp"
									stroke="#6b7280"
									fontSize={12}
									tickFormatter={(timestamp) =>
										new Date(timestamp).toLocaleTimeString()
									}
								/>
								<YAxis
									stroke="#6b7280"
									fontSize={12}
								/>
								<Area
									type="monotone"
									dataKey="requests"
									stroke="#10b981"
									fill="#10b981"
									fillOpacity={0.3}
									name="Requests"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Server List */}
			<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
				<CardHeader>
					<CardTitle className="text-white">
						Server Management
					</CardTitle>
					<CardDescription className="text-zinc-400">
						Monitor and manage your server infrastructure
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border border-zinc-800">
						<Table>
							<TableHeader>
								<TableRow className="border-zinc-800">
									<TableHead className="text-zinc-400">
										Server
									</TableHead>
									<TableHead className="text-zinc-400">
										Status
									</TableHead>
									<TableHead className="text-zinc-400">
										Load
									</TableHead>
									<TableHead className="text-zinc-400">
										Uptime
									</TableHead>
									<TableHead className="text-zinc-400">
										Region
									</TableHead>
									<TableHead className="text-zinc-400">
										Version
									</TableHead>
									<TableHead className="text-zinc-400">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{servers.map((server) => (
									<TableRow
										key={server.id}
										className="border-zinc-800"
									>
										<TableCell>
											<div className="flex items-center space-x-3">
												<Monitor className="h-4 w-4 text-zinc-400" />
												<div>
													<div className="font-medium text-white">
														{server.name}
													</div>
													<div className="text-sm text-zinc-400">
														{server.ip}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												{getStatusIcon(server.status)}
												<Badge
													className={getStatusColor(
														server.status
													)}
												>
													{server.status}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<div className="w-20">
													<Progress
														value={
															server.loadPercentage
														}
														className="h-2"
													/>
												</div>
												<span className="text-sm text-white">
													{server.loadPercentage}%
												</span>
											</div>
										</TableCell>
										<TableCell className="text-white">
											{server.uptime}%
										</TableCell>
										<TableCell className="text-zinc-300">
											{server.region}
										</TableCell>
										<TableCell className="text-zinc-300 font-mono">
											{server.version}
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														handleEditServer(server)
													}
													className="text-zinc-400 hover:text-white"
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														setDeletingServerId(
															server.id
														)
													}
													className="text-red-400 hover:text-red-300"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Log Viewer */}
			<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-white">
								System Logs
							</CardTitle>
							<CardDescription className="text-zinc-400">
								Real-time server logs and events
							</CardDescription>
						</div>
						<Button
							variant="outline"
							className="border-zinc-700 text-zinc-300"
						>
							<Download className="w-4 h-4 mr-2" />
							Export
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-4 mb-4">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
							<Input
								placeholder="Search logs..."
								value={logSearch}
								onChange={(e) => setLogSearch(e.target.value)}
								className="pl-10 bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<Select
							value={selectedServer}
							onValueChange={setSelectedServer}
						>
							<SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
								<Filter className="w-4 h-4 mr-2" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-zinc-900 border-zinc-700">
								<SelectItem value="all">All Servers</SelectItem>
								{servers.map((server) => (
									<SelectItem
										key={server.id}
										value={server.id}
									>
										{server.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={logLevel}
							onValueChange={setLogLevel}
						>
							<SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-zinc-900 border-zinc-700">
								<SelectItem value="all">All Levels</SelectItem>
								<SelectItem value="info">Info</SelectItem>
								<SelectItem value="warning">Warning</SelectItem>
								<SelectItem value="error">Error</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<ScrollArea className="h-96 rounded-md border border-zinc-800">
						<div className="p-4 space-y-2">
							{filteredLogs.slice(0, 50).map((log) => (
								<div
									key={log.id}
									className="flex items-start space-x-3 p-2 rounded-md hover:bg-zinc-800/50"
								>
									<Badge
										className={getLogLevelColor(log.level)}
									>
										{log.level}
									</Badge>
									<div className="flex items-center text-xs text-zinc-500 min-w-[120px]">
										<Clock className="w-3 h-3 mr-1" />
										{new Date(
											log.timestamp
										).toLocaleTimeString()}
									</div>
									<div className="text-sm text-zinc-300 flex-1">
										{log.message}
									</div>
									{log.ip && (
										<div className="text-xs text-zinc-500 font-mono">
											{log.ip}
										</div>
									)}
								</div>
							))}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>

			{/* Edit Server Dialog */}
			<Dialog
				open={!!editingServer}
				onOpenChange={(open) => !open && setEditingServer(null)}
			>
				<DialogContent className="bg-zinc-900 border-zinc-800">
					<DialogHeader>
						<DialogTitle className="text-white">
							Edit Server
						</DialogTitle>
						<DialogDescription className="text-zinc-400">
							Update server configuration
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label
								htmlFor="editServerName"
								className="text-zinc-300"
							>
								Server Name
							</Label>
							<Input
								id="editServerName"
								value={editForm.name}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										name: e.target.value,
									}))
								}
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<div className="grid gap-2">
							<Label
								htmlFor="editServerIp"
								className="text-zinc-300"
							>
								IP Address
							</Label>
							<Input
								id="editServerIp"
								value={editForm.ip}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										ip: e.target.value,
									}))
								}
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<div className="grid gap-2">
							<Label
								htmlFor="editServerRegion"
								className="text-zinc-300"
							>
								Region
							</Label>
							<Input
								id="editServerRegion"
								value={editForm.region}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										region: e.target.value,
									}))
								}
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<div className="grid gap-2">
							<Label
								htmlFor="editServerVersion"
								className="text-zinc-300"
							>
								Version
							</Label>
							<Input
								id="editServerVersion"
								value={editForm.version}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										version: e.target.value,
									}))
								}
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditingServer(null)}
							className="border-zinc-700 text-zinc-300"
						>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateServer}
							className="bg-blue-600 hover:bg-blue-700"
						>
							Update Server
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deletingServerId}
				onOpenChange={(open) => !open && setDeletingServerId(null)}
			>
				<AlertDialogContent className="bg-zinc-900 border-zinc-800">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-white">
							Are you sure?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							This action cannot be undone. This will permanently
							remove the server from monitoring and delete all
							associated logs.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								deletingServerId &&
								handleDeleteServer(deletingServerId)
							}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
