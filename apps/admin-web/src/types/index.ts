export interface UrlRecord {
  id: string;
  shortCode: string;
  longUrl: string;
  totalHits: number;
  createdAt: Date;
  lastClickedAt?: Date;
  isActive: boolean;
  tags?: string[];
}

export interface Server {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  ip: string;
  loadPercentage: number;
  uptime: number;
  region: string;
  version: string;
}

export interface TrafficData {
  date: string;
  clicks: number;
  uniqueClicks: number;
  conversions: number;
}

export interface GeographicData {
  country: string;
  clicks: number;
  percentage: number;
}

export interface ServerMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  requests: number;
  responseTime: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  serverId: string;
  ip?: string;
}

export type TimeRange = '24h' | '7d' | '30d' | 'custom';

export interface Analytics {
  totalClicks: number;
  activeUrls: number;
  conversionRate: number;
  topUrls: UrlRecord[];
  trafficData: TrafficData[];
  geographicData: GeographicData[];
}