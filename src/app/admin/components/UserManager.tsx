
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function UserManager() {
  return (
    <div className="grid gap-8 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>User management is currently disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground">
            <Users className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold">User Management Not Active</p>
            <p className="text-sm">Viewing and managing users is disabled.</p>
          </div>
        </CardContent>
      </Admins>
    </div>
  );
}
