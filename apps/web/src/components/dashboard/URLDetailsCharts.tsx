"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ClickData, ReferrerData, TimePeriod } from '@/lib/types';
import { getClickDataByPeriod, referrerData } from '@/lib/data';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function URLDetailsCharts() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7d');
  const [clickData, setClickData] = useState<ClickData[]>(getClickDataByPeriod('7d'));

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setClickData(getClickDataByPeriod(period));
  };

  const totalClicks = clickData.reduce((sum, data) => sum + data.clicks, 0);
  const totalUniqueVisitors = clickData.reduce((sum, data) => sum + data.uniqueVisitors, 0);

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analytics</CardTitle>
          <CardDescription>View your URL performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            {[
              { key: '24h' as TimePeriod, label: 'Last 24 Hours' },
              { key: '7d' as TimePeriod, label: 'Last 7 Days' },
              { key: '30d' as TimePeriod, label: 'Last 30 Days' },
            ].map((period) => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? 'default' : 'outline'}
                onClick={() => handlePeriodChange(period.key)}
              >
                {period.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                <p className="text-xs text-gray-500">Total Clicks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalUniqueVisitors.toLocaleString()}</div>
                <p className="text-xs text-gray-500">Unique Visitors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {totalUniqueVisitors > 0 ? ((totalUniqueVisitors / totalClicks) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-xs text-gray-500">Unique Rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clickData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Clicks"
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Unique Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Referrers Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={referrerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="clicks"
                  >
                    {referrerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Breakdown by traffic source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referrerData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="source" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}