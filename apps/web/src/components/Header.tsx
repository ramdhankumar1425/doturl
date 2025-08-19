import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { useAuthStore } from "@/stores/useAuthStore";
import { sendApiRequest } from "@/services/apiService";

export default function Header() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const clearAuth = useAuthStore((state) => state.clearAuth);
	const user = useAuthStore((state) => state.user);

	const handleLogout = async () => {
		try {
			const response = await sendApiRequest("/auth/logout", "POST");

			console.log("[Header] handleLogout Response:", response);

			if (response.success) {
				clearAuth();
				window.location.replace("/");
			}
		} catch (error) {
			console.error("[Header] Error in handleLogout:", error);
		}
	};

	return (
		<header className="bg-neutral-900 border-b border-neutral-700">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
				<Link
					href={"/"}
					className="pt-2 px-2 sm:px-4 text-xl sm:text-2xl font-kalam text-neutral-50"
				>
					.Url
				</Link>

				{isAuthenticated ? (
					<UserMenu
						user={user!}
						onLogout={handleLogout}
					/>
				) : (
					<div className="flex items-center space-x-2 sm:space-x-4">
						<Button
							variant="secondary"
							size="sm"
							className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
							asChild
						>
							<Link href="/auth/login">Log In</Link>
						</Button>
						<Button
							variant="default"
							size="sm"
							className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
							asChild
						>
							<Link href="/auth/signup">Sign Up</Link>
						</Button>
					</div>
				)}
			</div>
		</header>
	);
}
