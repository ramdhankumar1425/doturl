import { URL, ClickData, ReferrerData, DashboardStats } from './types';
import { subDays, format, subHours } from 'date-fns';

export const mockUrls: URL[] = [
  {
    id: '1',
    originalUrl: 'https://www.example.com/very-long-url-that-needs-shortening',
    shortUrl: 'https://short.ly/abc123',
    slug: 'abc123',
    clicks: 1247,
    uniqueVisitors: 892,
    createdAt: subDays(new Date(), 5),
    lastClicked: subHours(new Date(), 2),
  },
  {
    id: '2',
    originalUrl: 'https://blog.example.com/how-to-build-great-products',
    shortUrl: 'https://short.ly/build-great',
    slug: 'build-great',
    clicks: 856,
    uniqueVisitors: 634,
    createdAt: subDays(new Date(), 12),
    lastClicked: subHours(new Date(), 5),
  },
  {
    id: '3',
    originalUrl: 'https://docs.example.com/api/reference/authentication',
    shortUrl: 'https://short.ly/api-auth',
    slug: 'api-auth',
    clicks: 432,
    uniqueVisitors: 298,
    createdAt: subDays(new Date(), 3),
    lastClicked: subHours(new Date(), 1),
  },
  {
    id: '4',
    originalUrl: 'https://github.com/example/awesome-project',
    shortUrl: 'https://short.ly/awesome-gh',
    slug: 'awesome-gh',
    clicks: 2341,
    uniqueVisitors: 1876,
    createdAt: subDays(new Date(), 18),
    lastClicked: subHours(new Date(), 3),
  },
];

export const dashboardStats: DashboardStats = {
  totalUrls: 4,
  totalClicks: 4876,
  uniqueVisitors: 3700,
  recentClicks: 124,
};

export const clickData24h: ClickData[] = Array.from({ length: 24 }, (_, i) => ({
  date: format(subHours(new Date(), 23 - i), 'HH:mm'),
  clicks: Math.floor(Math.random() * 50) + 10,
  uniqueVisitors: Math.floor(Math.random() * 35) + 5,
}));

export const clickData7d: ClickData[] = Array.from({ length: 7 }, (_, i) => ({
  date: format(subDays(new Date(), 6 - i), 'MMM dd'),
  clicks: Math.floor(Math.random() * 200) + 50,
  uniqueVisitors: Math.floor(Math.random() * 150) + 30,
}));

export const clickData30d: ClickData[] = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'MMM dd'),
  clicks: Math.floor(Math.random() * 300) + 100,
  uniqueVisitors: Math.floor(Math.random() * 200) + 60,
}));

export const referrerData: ReferrerData[] = [
  { source: 'Direct', clicks: 1247, percentage: 35.2 },
  { source: 'Google', clicks: 892, percentage: 25.1 },
  { source: 'Twitter', clicks: 634, percentage: 17.9 },
  { source: 'Facebook', clicks: 423, percentage: 11.9 },
  { source: 'LinkedIn', clicks: 298, percentage: 8.4 },
  { source: 'Other', clicks: 52, percentage: 1.5 },
];

export const getClickDataByPeriod = (period: string): ClickData[] => {
  switch (period) {
    case '24h':
      return clickData24h;
    case '7d':
      return clickData7d;
    case '30d':
      return clickData30d;
    default:
      return clickData7d;
  }
};