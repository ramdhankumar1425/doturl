import { IApiMetric } from "types";
import { publishMetrics } from "./publisher.js";
import {
	getCpuUsageSnapshot,
	getRamUsageSnapshot,
} from "../utils/resourceUsage.js";
import ENV from "../config/env.config.js";

interface MetricBufferItem {
	method: string;
	url: string;
	statusCode: number;
	durationMs: number;
	timestamp: number;
}

let isCollecting = false;
let metricsBuffer: MetricBufferItem[] = [];
let flushIntervalMs: number = 10_000;
const maxMetricsBufferLength = 100;
let flushInterval: NodeJS.Timeout | null = null; // set-interval instance

export function startCollecting(intervalMs?: number) {
	if (isCollecting) return;

	isCollecting = true;
	if (intervalMs) flushIntervalMs = intervalMs;

	flushInterval = setInterval(flushMetrics, flushIntervalMs);
}

export function stopCollecting() {
	if (!isCollecting) return;

	isCollecting = false;
	metricsBuffer = [];

	if (flushInterval !== null) {
		clearInterval(flushInterval);
		flushInterval = null;
	}
}

export function recordMetrics(metric: MetricBufferItem) {
	if (!isCollecting) return;

	if (metricsBuffer.length < maxMetricsBufferLength) {
		metricsBuffer.push(metric);
	} else {
		metricsBuffer = [metric];
	}
}

export async function flushMetrics() {
	if (!isCollecting) return;

	const durations = metricsBuffer
		.map((m) => m.durationMs)
		.sort((a, b) => a - b);
	const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
	const p95 = durations[Math.floor(durations.length * 0.95)];

	const cpuUsage = await getCpuUsageSnapshot();
	const ramUsage = getRamUsageSnapshot();

	const metric: IApiMetric = {
		serverName: ENV.SERVER_NAME,
		totalRequests: metricsBuffer.length,
		avgResponseMs: avg,
		p95ResponseMs: p95,
		ramUsage: ramUsage,
		cpuPercentUsage: cpuUsage,
		timestamp: Date.now(),
	};

	await publishMetrics(metric);
	metricsBuffer = [];
}
