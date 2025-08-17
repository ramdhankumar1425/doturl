"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Copy, 
  Edit, 
  Trash2, 
  BarChart3 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { URL } from '@/lib/types';
import { format } from 'date-fns';

interface URLsTableProps {
  urls: URL[];
}

export default function URLsTable({ urls }: URLsTableProps) {
  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Original URL</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Short URL</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="max-w-xs truncate" title={url.originalUrl}>
                      {url.originalUrl}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                        {url.shortUrl.split('/').pop()}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(url.shortUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{url.clicks}</span>
                      <Link href={`/dashboard/url/${url.id}`}>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {format(url.createdAt, 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}