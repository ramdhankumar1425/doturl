export interface URL {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  clicks: number;
  uniqueVisitors: number;
  createdAt: Date;
  lastClicked?: Date;
}

export interface ClickData {
  date: string;
  clicks: number;
  uniqueVisitors: number;
}

export interface ReferrerData {
  source: string;
  clicks: number;
  percentage: number;
}

export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  uniqueVisitors: number;
  recentClicks: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type TimePeriod = '24h' | '7d' | '30d';