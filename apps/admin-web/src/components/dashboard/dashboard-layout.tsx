"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	BarChart3,
	Database,
	Server,
	Menu,
	TrendingUp,
	Globe,
	Activity,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const navigation = [
	{
		name: "Traffic Analytics",
		href: "/traffic",
		icon: BarChart3,
		description: "View traffic metrics and performance",
	},
	{
		name: "Database Models",
		href: "/database",
		icon: Database,
		description: "Manage URL records and data",
	},
	{
		name: "Server Maintenance",
		href: "/servers",
		icon: Server,
		description: "Monitor server health and logs",
	},
];

function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();

	return (
		<div className={cn("pb-12 w-80", className)}>
			<div className="space-y-4 py-4">
				<div className="px-6 py-4">
					<div className="flex items-center space-x-2 mb-8">
						<Globe className="h-8 w-8 text-blue-500" />
						<div>
							<h1 className="text-2xl font-bold text-white">
								ShortLink Pro
							</h1>
							<p className="text-sm text-zinc-400">
								Admin Dashboard
							</p>
						</div>
					</div>
					<nav className="space-y-2">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-zinc-800/50",
										isActive
											? "bg-zinc-800 text-white shadow-md border border-zinc-700"
											: "text-zinc-400 hover:text-white"
									)}
								>
									<item.icon
										className={cn(
											"mr-3 h-5 w-5",
											isActive
												? "text-blue-500"
												: "text-zinc-500"
										)}
									/>
									<div className="flex flex-col">
										<span>{item.name}</span>
										<span className="text-xs text-zinc-500 mt-0.5">
											{item.description}
										</span>
									</div>
								</Link>
							);
						})}
					</nav>
				</div>
			</div>
		</div>
	);
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-zinc-950">
			{/* Desktop sidebar */}
			<div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:z-50 lg:w-80 lg:flex-col">
				<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900/50 border-r border-zinc-800 backdrop-blur-xl">
					<Sidebar />
				</div>
			</div>

			{/* Mobile sidebar */}
			<Sheet
				open={sidebarOpen}
				onOpenChange={setSidebarOpen}
			>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="lg:hidden fixed top-4 left-4 z-40 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700"
					>
						<Menu className="h-6 w-6" />
					</Button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="p-0 bg-zinc-900 border-zinc-800 w-80"
				>
					<Sidebar />
				</SheetContent>
			</Sheet>

			{/* Main content */}
			<div className="lg:pl-80">
				<main className="min-h-screen">
					<div className="p-6 lg:p-8">{children}</div>
				</main>
			</div>
		</div>
	);
}
