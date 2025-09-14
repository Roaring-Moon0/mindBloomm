
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Youtube } from 'lucide-react';

export default function VideoManager() {
  return (
    <div className="grid gap-8 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Manage Videos</CardTitle>
          <CardDescription>Video management is currently disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground">
            <Youtube className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold">Video Management Not Active</p>
            <p className="text-sm">Adding, editing, and viewing videos is disabled.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
