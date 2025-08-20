import AppSidebar from "@/components/dashboard/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1 relative">
				{/* <SidebarTrigger className="absolute top-0 -left-4" /> */}
				{children}
			</main>
		</SidebarProvider>
	);
}
