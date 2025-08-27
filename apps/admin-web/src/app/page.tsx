"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { io } from "socket.io-client";

export default function Home() {
	const connectSocket = () => {
		const socket = io("http://localhost:8081");
	};

	return (
		<DashboardLayout>
			<div></div>
		</DashboardLayout>
	);
}
