"use client";

import AppSidebar from "@/components/dashboard/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isLoading = useAuthStore((state) => state.isLoading);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const router = useRouter();

	if (!isLoading && !isAuthenticated) router.replace("/");

	return !isLoading ? (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1 relative">
				{/* <SidebarTrigger className="absolute top-0 -left-4" /> */}
				{children}
			</main>
		</SidebarProvider>
	) : null;
}
