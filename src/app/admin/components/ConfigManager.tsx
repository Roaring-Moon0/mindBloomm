
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Megaphone, ToggleRight } from 'lucide-react';

export default function ConfigManager() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>App Config</CardTitle>
          <CardDescription>Configuration management is currently disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <Settings className="mx-auto h-12 w-12" />
            <p className="mt-4">App configuration is disabled.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Feature management is currently disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <ToggleRight className="mx-auto h-12 w-12" />
            <p className="mt-4">Feature toggles are disabled.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Announcement management is currently disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <Megaphone className="mx-auto h-12 w-12" />
            <p className="mt-4">Adding or removing announcements is disabled.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
