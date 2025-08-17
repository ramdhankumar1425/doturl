"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function AuthLoader() {
	const isLoading = useAuthStore((state) => state.isLoading);
	const refreshAuth = useAuthStore((state) => state.refreshAuth);

	useEffect(() => {
		refreshAuth();
	}, []);

	return isLoading ? (
		<div className="absolute top-0 left-0 right-0 min-h-screen bg-neutral-900 flex items-center justify-center z-[1000]">
			<Loader2 className="animate-spin size-10" />
		</div>
	) : null;
}
