"use client";

import {
	EllipsisVertical,
	Home,
	Settings,
	Link as LinkIcon,
	Key,
	CreditCard,
	ChartNoAxesGantt,
	LogOut,
	ChartColumn,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

// Menu items.
const dashboardItems = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Your links",
		url: "/dashboard/urls",
		icon: LinkIcon,
	},
	{
		title: "Analytics",
		url: "#",
		icon: ChartColumn,
	},

	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
];
const premiumItems = [
	{
		title: "API Keys",
		url: "#",
		icon: Key,
	},
	{
		title: "Billing",
		url: "#",
		icon: CreditCard,
	},
	{
		title: "Change Plan",
		url: "#",
		icon: ChartNoAxesGantt,
	},
];

export default function AppSidebar() {
	const user = useAuthStore((state) => state.user);

	return (
		<Sidebar>
			<SidebarHeader>
				<Link
					href={"/"}
					className="pt-2 px-4 text-2xl font-kalam text-neutral-50"
				>
					.Url
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{dashboardItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Premium</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{premiumItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<div className="flex mb-2 py-2 px-1 w-full items-center cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
							<Avatar>
								<AvatarImage
									src={
										user?.avatar
											? user.avatar
											: "https://github.com/shadcn.png"
									}
									alt={user?.name || "User avatar"}
								/>
								<AvatarFallback>
									{user?.name?.charAt(0).toUpperCase() || "A"}
								</AvatarFallback>
							</Avatar>

							<div className="text-start flex-1 ml-3">
								<p className="text-neutral-200 font-normal text-base">
									{user?.name && user.name.length > 15
										? user.name.slice(0, 15) + "..."
										: user?.name}
								</p>
								<p className="text-neutral-400 font-light text-sm">
									{user?.email && user.email.length > 15
										? user.email.slice(0, 15) + "..."
										: user?.email}
								</p>
							</div>

							<EllipsisVertical size={20} />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-48">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Billing</DropdownMenuItem>
						<DropdownMenuItem>Team</DropdownMenuItem>
						<DropdownMenuItem>Subscription</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Button
								variant="ghost"
								className="w-full"
							>
								<LogOut />
								<p className="text-start text-red-500 w-full">
									Logout
								</p>
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
