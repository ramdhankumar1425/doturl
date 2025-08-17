import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
	return (
		<footer className="mx-8 pt-10 pb-20 bg-neutral-900 border-t border-neutral-700">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<div className="font-semibold">
					&copy; 2025 SMALLII -{" "}
					<span className="underline underline-offset-2">
						smallii.io
					</span>
				</div>

				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						asChild
					>
						<Link href="#">
							<Github />
						</Link>
					</Button>
					<Button
						variant="ghost"
						asChild
					>
						<Link href="#">
							<Linkedin />
						</Link>
					</Button>

					<Button
						variant="ghost"
						asChild
					>
						<Link href="#">
							<Facebook />
						</Link>
					</Button>
					<Button
						variant="ghost"
						asChild
					>
						<Link href="#">
							<Instagram />
						</Link>
					</Button>
				</div>
			</div>
		</footer>
	);
}
