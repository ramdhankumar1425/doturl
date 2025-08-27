"use client";

import { useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	ExternalLink,
	Copy,
	Filter,
	Database,
	Link,
	Calendar,
	MousePointer,
	MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { mockUrls } from "@/lib/mock-data";
import { UrlRecord } from "@/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditUrlFormData {
	shortCode: string;
	longUrl: string;
	isActive: boolean;
	tags: string;
}

export default function DatabaseModels() {
	const [urls, setUrls] = useState<UrlRecord[]>(mockUrls);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingUrl, setEditingUrl] = useState<UrlRecord | null>(null);
	const [deletingUrlId, setDeletingUrlId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	const [newUrl, setNewUrl] = useState({
		shortCode: "",
		longUrl: "",
		isActive: true,
		tags: "",
	});

	const [editForm, setEditForm] = useState<EditUrlFormData>({
		shortCode: "",
		longUrl: "",
		isActive: true,
		tags: "",
	});

	// Filter and search URLs
	const filteredUrls = useMemo(() => {
		return urls.filter((url) => {
			const matchesSearch =
				url.shortCode
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				url.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(url.tags &&
					url.tags.some((tag) =>
						tag.toLowerCase().includes(searchTerm.toLowerCase())
					));

			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && url.isActive) ||
				(statusFilter === "inactive" && !url.isActive);

			return matchesSearch && matchesStatus;
		});
	}, [urls, searchTerm, statusFilter]);

	// Pagination
	const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
	const paginatedUrls = filteredUrls.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const generateShortCode = (): string => {
		return Math.random().toString(36).substr(2, 8);
	};

	const handleCreateUrl = () => {
		if (!newUrl.longUrl || !newUrl.shortCode) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Check if short code already exists
		if (urls.some((url) => url.shortCode === newUrl.shortCode)) {
			toast.error("Short code already exists");
			return;
		}

		const url: UrlRecord = {
			id: Date.now().toString(),
			shortCode: newUrl.shortCode,
			longUrl: newUrl.longUrl,
			totalHits: 0,
			createdAt: new Date(),
			isActive: newUrl.isActive,
			tags: newUrl.tags
				? newUrl.tags.split(",").map((tag) => tag.trim())
				: [],
		};

		setUrls((prev) => [url, ...prev]);
		setNewUrl({ shortCode: "", longUrl: "", isActive: true, tags: "" });
		setIsCreateDialogOpen(false);
		toast.success("URL created successfully");
	};

	const handleEditUrl = (url: UrlRecord) => {
		setEditingUrl(url);
		setEditForm({
			shortCode: url.shortCode,
			longUrl: url.longUrl,
			isActive: url.isActive,
			tags: url.tags?.join(", ") || "",
		});
	};

	const handleUpdateUrl = () => {
		if (!editingUrl || !editForm.longUrl || !editForm.shortCode) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Check if short code already exists (excluding current URL)
		if (
			urls.some(
				(url) =>
					url.shortCode === editForm.shortCode &&
					url.id !== editingUrl.id
			)
		) {
			toast.error("Short code already exists");
			return;
		}

		setUrls((prev) =>
			prev.map((url) =>
				url.id === editingUrl.id
					? {
							...url,
							shortCode: editForm.shortCode,
							longUrl: editForm.longUrl,
							isActive: editForm.isActive,
							tags: editForm.tags
								? editForm.tags
										.split(",")
										.map((tag) => tag.trim())
								: [],
					  }
					: url
			)
		);

		setEditingUrl(null);
		toast.success("URL updated successfully");
	};

	const handleDeleteUrl = (id: string) => {
		setUrls((prev) => prev.filter((url) => url.id !== id));
		setDeletingUrlId(null);
		toast.success("URL deleted successfully");
	};

	const handleBulkDelete = () => {
		setUrls((prev) => prev.filter((url) => !selectedUrls.includes(url.id)));
		setSelectedUrls([]);
		toast.success(`${selectedUrls.length} URLs deleted successfully`);
	};

	const handleBulkToggleStatus = (active: boolean) => {
		setUrls((prev) =>
			prev.map((url) =>
				selectedUrls.includes(url.id)
					? { ...url, isActive: active }
					: url
			)
		);
		setSelectedUrls([]);
		toast.success(
			`${selectedUrls.length} URLs ${
				active ? "activated" : "deactivated"
			} successfully`
		);
	};

	const toggleUrlSelection = (id: string) => {
		setSelectedUrls((prev) =>
			prev.includes(id)
				? prev.filter((urlId) => urlId !== id)
				: [...prev, id]
		);
	};

	const toggleAllSelection = () => {
		if (selectedUrls.length === paginatedUrls.length) {
			setSelectedUrls([]);
		} else {
			setSelectedUrls(paginatedUrls.map((url) => url.id));
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-white">
						Database Models
					</h1>
					<p className="text-zinc-400 mt-1">
						Manage your URL records and configurations
					</p>
				</div>
				<Dialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
				>
					<DialogTrigger asChild>
						<Button className="bg-blue-600 hover:bg-blue-700">
							<Plus className="w-4 h-4 mr-2" />
							Create URL
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-zinc-900 border-zinc-800">
						<DialogHeader>
							<DialogTitle className="text-white">
								Create New URL
							</DialogTitle>
							<DialogDescription className="text-zinc-400">
								Add a new shortened URL to your collection
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label
									htmlFor="shortCode"
									className="text-zinc-300"
								>
									Short Code
								</Label>
								<div className="flex gap-2">
									<Input
										id="shortCode"
										value={newUrl.shortCode}
										onChange={(e) =>
											setNewUrl((prev) => ({
												...prev,
												shortCode: e.target.value,
											}))
										}
										placeholder="e.g., abc123"
										className="bg-zinc-800 border-zinc-700 text-white"
									/>
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											setNewUrl((prev) => ({
												...prev,
												shortCode: generateShortCode(),
											}))
										}
										className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
									>
										Generate
									</Button>
								</div>
							</div>
							<div className="grid gap-2">
								<Label
									htmlFor="longUrl"
									className="text-zinc-300"
								>
									Original URL
								</Label>
								<Input
									id="longUrl"
									type="url"
									value={newUrl.longUrl}
									onChange={(e) =>
										setNewUrl((prev) => ({
											...prev,
											longUrl: e.target.value,
										}))
									}
									placeholder="https://example.com/very/long/url"
									className="bg-zinc-800 border-zinc-700 text-white"
								/>
							</div>
							<div className="grid gap-2">
								<Label
									htmlFor="tags"
									className="text-zinc-300"
								>
									Tags (comma-separated)
								</Label>
								<Input
									id="tags"
									value={newUrl.tags}
									onChange={(e) =>
										setNewUrl((prev) => ({
											...prev,
											tags: e.target.value,
										}))
									}
									placeholder="e.g., marketing, campaign, social"
									className="bg-zinc-800 border-zinc-700 text-white"
								/>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="isActive"
									checked={newUrl.isActive}
									onCheckedChange={(checked) =>
										setNewUrl((prev) => ({
											...prev,
											isActive: !!checked,
										}))
									}
								/>
								<Label
									htmlFor="isActive"
									className="text-zinc-300"
								>
									Active
								</Label>
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
								onClick={handleCreateUrl}
								className="bg-blue-600 hover:bg-blue-700"
							>
								Create URL
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Total URLs
						</CardTitle>
						<Database className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{urls.length}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							{urls.filter((url) => url.isActive).length} active
						</p>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Total Clicks
						</CardTitle>
						<MousePointer className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{urls
								.reduce((sum, url) => sum + url.totalHits, 0)
								.toLocaleString()}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							Across all URLs
						</p>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Active URLs
						</CardTitle>
						<Link className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{urls.filter((url) => url.isActive).length}
						</div>
						<p className="text-xs text-zinc-500 mt-1">
							{(
								(urls.filter((url) => url.isActive).length /
									urls.length) *
								100
							).toFixed(1)}
							% of total
						</p>
					</CardContent>
				</Card>

				<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Avg. Clicks
						</CardTitle>
						<Calendar className="h-4 w-4 text-purple-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">
							{urls.length > 0
								? Math.round(
										urls.reduce(
											(sum, url) => sum + url.totalHits,
											0
										) / urls.length
								  )
								: 0}
						</div>
						<p className="text-xs text-zinc-500 mt-1">Per URL</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-white">
								URL Management
							</CardTitle>
							<CardDescription className="text-zinc-400">
								Manage your shortened URLs and their settings
							</CardDescription>
						</div>
						{selectedUrls.length > 0 && (
							<div className="flex items-center space-x-2">
								<Badge
									variant="secondary"
									className="bg-blue-900 text-blue-300"
								>
									{selectedUrls.length} selected
								</Badge>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkToggleStatus(true)}
									className="border-zinc-700 text-green-400 hover:bg-green-900/20"
								>
									Activate
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() =>
										handleBulkToggleStatus(false)
									}
									className="border-zinc-700 text-orange-400 hover:bg-orange-900/20"
								>
									Deactivate
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={handleBulkDelete}
									className="border-zinc-700 text-red-400 hover:bg-red-900/20"
								>
									Delete
								</Button>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-4 mb-6">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
							<Input
								placeholder="Search URLs, codes, or tags..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
								<Filter className="w-4 h-4 mr-2" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-zinc-900 border-zinc-700">
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">
									Active Only
								</SelectItem>
								<SelectItem value="inactive">
									Inactive Only
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border border-zinc-800">
						<Table>
							<TableHeader>
								<TableRow className="border-zinc-800">
									<TableHead className="w-12">
										<Checkbox
											checked={
												selectedUrls.length ===
													paginatedUrls.length &&
												paginatedUrls.length > 0
											}
											onCheckedChange={toggleAllSelection}
										/>
									</TableHead>
									<TableHead className="text-zinc-400">
										Short Code
									</TableHead>
									<TableHead className="text-zinc-400">
										Original URL
									</TableHead>
									<TableHead className="text-zinc-400">
										Clicks
									</TableHead>
									<TableHead className="text-zinc-400">
										Status
									</TableHead>
									<TableHead className="text-zinc-400">
										Created
									</TableHead>
									<TableHead className="text-zinc-400">
										Tags
									</TableHead>
									<TableHead className="text-zinc-400">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedUrls.map((url) => (
									<TableRow
										key={url.id}
										className="border-zinc-800"
									>
										<TableCell>
											<Checkbox
												checked={selectedUrls.includes(
													url.id
												)}
												onCheckedChange={() =>
													toggleUrlSelection(url.id)
												}
											/>
										</TableCell>
										<TableCell className="font-mono text-blue-400">
											<div className="flex items-center space-x-2">
												<span>{url.shortCode}</span>
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														copyToClipboard(
															`https://short.ly/${url.shortCode}`
														)
													}
													className="p-1 h-auto text-zinc-400 hover:text-white"
												>
													<Copy className="h-3 w-3" />
												</Button>
											</div>
										</TableCell>
										<TableCell className="text-zinc-300 max-w-xs">
											<div className="flex items-center space-x-2">
												<span className="truncate">
													{url.longUrl}
												</span>
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														window.open(
															url.longUrl,
															"_blank"
														)
													}
													className="p-1 h-auto text-zinc-400 hover:text-white"
												>
													<ExternalLink className="h-3 w-3" />
												</Button>
											</div>
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
											<div className="flex flex-wrap gap-1">
												{url.tags
													?.slice(0, 2)
													.map((tag) => (
														<Badge
															key={tag}
															variant="outline"
															className="text-xs border-zinc-700 text-zinc-400"
														>
															{tag}
														</Badge>
													))}
												{url.tags &&
													url.tags.length > 2 && (
														<Badge
															variant="outline"
															className="text-xs border-zinc-700 text-zinc-400"
														>
															+
															{url.tags.length -
																2}
														</Badge>
													)}
											</div>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														size="sm"
														variant="ghost"
														className="text-zinc-400 hover:text-white p-1"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="bg-zinc-900 border-zinc-800">
													<DropdownMenuItem
														onClick={() =>
															handleEditUrl(url)
														}
														className="text-zinc-300 hover:text-white"
													>
														<Edit className="h-4 w-4 mr-2" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															copyToClipboard(
																`https://short.ly/${url.shortCode}`
															)
														}
														className="text-zinc-300 hover:text-white"
													>
														<Copy className="h-4 w-4 mr-2" />
														Copy Link
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															setDeletingUrlId(
																url.id
															)
														}
														className="text-red-400 hover:text-red-300"
													>
														<Trash2 className="h-4 w-4 mr-2" />
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

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-4">
							<p className="text-sm text-zinc-400">
								Showing {(currentPage - 1) * itemsPerPage + 1}{" "}
								to{" "}
								{Math.min(
									currentPage * itemsPerPage,
									filteredUrls.length
								)}{" "}
								of {filteredUrls.length} results
							</p>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setCurrentPage((prev) =>
											Math.max(1, prev - 1)
										)
									}
									disabled={currentPage === 1}
									className="border-zinc-700 text-zinc-300"
								>
									Previous
								</Button>
								<span className="text-zinc-400">
									Page {currentPage} of {totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setCurrentPage((prev) =>
											Math.min(totalPages, prev + 1)
										)
									}
									disabled={currentPage === totalPages}
									className="border-zinc-700 text-zinc-300"
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Edit URL Dialog */}
			<Dialog
				open={!!editingUrl}
				onOpenChange={(open) => !open && setEditingUrl(null)}
			>
				<DialogContent className="bg-zinc-900 border-zinc-800">
					<DialogHeader>
						<DialogTitle className="text-white">
							Edit URL
						</DialogTitle>
						<DialogDescription className="text-zinc-400">
							Update the URL record details
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label
								htmlFor="editShortCode"
								className="text-zinc-300"
							>
								Short Code
							</Label>
							<Input
								id="editShortCode"
								value={editForm.shortCode}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										shortCode: e.target.value,
									}))
								}
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<div className="grid gap-2">
							<Label
								htmlFor="editLongUrl"
								className="text-zinc-300"
							>
								Original URL
							</Label>
							<Input
								id="editLongUrl"
								type="url"
								value={editForm.longUrl}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										longUrl: e.target.value,
									}))
								}
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<div className="grid gap-2">
							<Label
								htmlFor="editTags"
								className="text-zinc-300"
							>
								Tags (comma-separated)
							</Label>
							<Input
								id="editTags"
								value={editForm.tags}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										tags: e.target.value,
									}))
								}
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="editIsActive"
								checked={editForm.isActive}
								onCheckedChange={(checked) =>
									setEditForm((prev) => ({
										...prev,
										isActive: !!checked,
									}))
								}
							/>
							<Label
								htmlFor="editIsActive"
								className="text-zinc-300"
							>
								Active
							</Label>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditingUrl(null)}
							className="border-zinc-700 text-zinc-300"
						>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateUrl}
							className="bg-blue-600 hover:bg-blue-700"
						>
							Update URL
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deletingUrlId}
				onOpenChange={(open) => !open && setDeletingUrlId(null)}
			>
				<AlertDialogContent className="bg-zinc-900 border-zinc-800">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-white">
							Are you sure?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400">
							This action cannot be undone. This will permanently
							delete the URL record and all associated click data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								deletingUrlId && handleDeleteUrl(deletingUrlId)
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
