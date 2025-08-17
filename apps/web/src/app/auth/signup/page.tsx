"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({ email, password });
	};

	const handleGithubLogin = () => {
		// Github OAuth redirect
	};

	const handleGoogleLogin = () => {
		// Google OAuth redirect
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
			<Card className="w-full max-w-md p-6 bg-neutral-800">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl">
						Create an account
					</CardTitle>
					<CardDescription>
						Enter your email below to create your account
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Social buttons */}
					<div className="flex gap-4 justify-center">
						<Button
							variant="outline"
							className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
							onClick={handleGithubLogin}
						>
							<Github size={20} /> Github
						</Button>
						<Button
							variant="outline"
							className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
							onClick={handleGoogleLogin}
						>
							{/* <Google size={20} />  */}
							Google
						</Button>
					</div>

					{/* Divider with text */}
					<div className="relative flex items-center">
						<div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
						<span className="px-3 text-gray-500 dark:text-gray-400 text-sm">
							OR CONTINUE WITH
						</span>
						<div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
					</div>

					{/* Email & Password form */}
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div className="space-y-1">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-200"
							>
								Email
							</label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-1">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 dark:text-gray-200"
							>
								Password
							</label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
						>
							Sign Up
						</Button>
					</form>

					{/* Already have an account */}
					<p className="text-sm text-center text-gray-500 dark:text-gray-400">
						Already have an account?{" "}
						<Link
							href="/auth/login"
							className="text-blue-600 hover:underline dark:text-blue-400"
						>
							Login
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
