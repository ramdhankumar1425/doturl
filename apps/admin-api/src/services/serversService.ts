import prisma from "../prisma.js";
import type { Server } from "@prisma/client";

let serversCache: Server[] = [];

export async function refreshServers(): Promise<void> {
	serversCache = await prisma.server.findMany();
	console.log("TotalServers:", serversCache[0]);
}

export function getServers(): Server[] {
	return serversCache;
}
