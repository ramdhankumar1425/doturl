"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { useSocketStore } from "@/stores/useSocketStore";
import React, { useEffect } from "react";

export default function layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initSocket = useSocketStore((state) => state.initSocket);
	const socket = useSocketStore((state) => state.socket);

	useEffect(() => {
		if (!socket) initSocket();
	}, []);

	return <DashboardLayout>{children}</DashboardLayout>;
}
