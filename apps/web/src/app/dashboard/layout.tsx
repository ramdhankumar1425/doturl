import AppSidebar from "@/components/dashboard/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider className="flex h-screen overflow-hidden">
			<AppSidebar />
			<main className="flex-1 relative overflow-y-auto">{children}</main>
		</SidebarProvider>
	);
}
