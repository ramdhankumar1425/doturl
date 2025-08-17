"use client";

import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import Link from "next/link";
import { IUser } from "types";

interface UserMenuProps {
	user: IUser;
	onLogout: () => void;
}

export const UserMenu: FC<UserMenuProps> = ({ user, onLogout }) => {
	return (
		<HoverCard
			openDelay={50}
			closeDelay={50}
		>
			<HoverCardTrigger asChild>
				<button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent focus:outline-none cursor-pointer">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={
								user.avatar ||
								"https://images.pexels.com/photos/33027861/pexels-photo-33027861.jpeg"
							}
							alt={user.name}
						/>
						<AvatarFallback>
							{user.name?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<span className="hidden sm:inline text-sm font-medium leading-none">
						{user.name}
					</span>
					<ChevronDown className="h-4 w-4 text-muted-foreground" />
				</button>
			</HoverCardTrigger>

			<HoverCardContent
				align="end"
				className="w-52 p-2"
			>
				<div className="px-2 py-1">
					<div className="font-medium">{user.name}</div>
					{user.email && (
						<p className="text-xs text-muted-foreground">
							{user.email}
						</p>
					)}
				</div>
				<hr className="my-1 border-border" />

				<Link href="/dashboard">
					<div className="flex items-center px-2 py-2 text-sm rounded hover:bg-accent cursor-pointer">
						<LayoutDashboard className="mr-2 h-4 w-4" />
						Dashboard
					</div>
				</Link>

				<hr className="my-1 border-border" />

				<div
					onClick={onLogout}
					className="flex items-center px-2 py-2 text-sm text-red-500 rounded hover:bg-accent hover:text-red-500 cursor-pointer"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Logout
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};
