import React from "react";

export default function DashboardHeader({
	title,
	action,
}: {
	title: string;
	action: React.ReactNode;
}) {
	return (
		<div className="border-b flex items-center justify-between p-4">
			<h1 className="scroll-m-20 text-start text-xl font-semibold tracking-tight text-balance text-neutral-300">
				{title}
			</h1>

			{action}
		</div>
	);
}
