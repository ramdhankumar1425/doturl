import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
	return (
		<footer className="mx-4 sm:mx-6 lg:mx-8 pt-2 pb-6 sm:pb-8 lg:pb-10 bg-neutral-900 border-t border-neutral-700">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
				<div className="font-semibold text-xs sm:text-sm text-center sm:text-left">
					&copy; 2025 DotUrl -{" "}
					<span className="underline underline-offset-2">
						doturl.tech
					</span>
				</div>

				<div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
					<Button
						variant="ghost"
						size="sm"
						className="p-1 sm:p-1.5 lg:p-2"
						asChild
					>
						<Link
							href="#"
							aria-label="GitHub"
						>
							<Github className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="p-1 sm:p-1.5 lg:p-2"
						asChild
					>
						<Link
							href="#"
							aria-label="LinkedIn"
						>
							<Linkedin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
						</Link>
					</Button>

					<Button
						variant="ghost"
						size="sm"
						className="p-1 sm:p-1.5 lg:p-2"
						asChild
					>
						<Link
							href="#"
							aria-label="Facebook"
						>
							<Facebook className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="p-1 sm:p-1.5 lg:p-2"
						asChild
					>
						<Link
							href="#"
							aria-label="Instagram"
						>
							<Instagram className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
						</Link>
					</Button>
				</div>
			</div>
		</footer>
	);
}
