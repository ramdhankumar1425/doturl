"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import React, { useEffect } from "react";

export default function AuthLoader({
	children,
	noAuth, // This is a boolean flag set by middleware that checks if user is has auth
}: {
	children: React.ReactNode;
	noAuth: boolean;
}) {
	const isRestoring = useAuthStore((state) => state.isRestoring);
	const syncAuth = useAuthStore((state) => state.syncAuth);
	const setState = useAuthStore.setState;

	// load auth
	useEffect(() => {
		if (noAuth) {
			setState({
				isRestoring: false,
			});
			return;
		}

		syncAuth(false);
	}, [syncAuth]);

	if (isRestoring)
		return (
			<div className="absolute top-0 left-0 right-0 min-h-screen bg-neutral-900 flex items-center justify-center z-[1000]">
				<p className="text-4xl font-kalam text-neutral-50 animate-pulse">
					.Url
				</p>
			</div>
		);

	return <>{children}</>;
}
