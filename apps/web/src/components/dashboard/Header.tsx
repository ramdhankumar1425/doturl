import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

export default function DashboardHeader({
	title,
	action,
}: {
	title: string;
	action: React.ReactNode;
}) {
	return (
		<div className="border-b flex items-center justify-between p-4 pl-0">
			<div className="flex items-center space-x-2 sm:space-x-4">
				<SidebarTrigger className="px-5 py-4 z-50" />
				<h1 className="max-w-32 sm:max-w-40 md:max-w-96 truncate scroll-m-20 text-start text-lg sm:text-xl font-semibold tracking-tight text-balance text-neutral-300">
					{title}
				</h1>
			</div>

			{action}
		</div>
	);
}
