
'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AdminContent() {
    const { user, logout } = useAdminAuth();
    
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Welcome, {user?.email}.</p>
                </div>
                <Button variant="outline" onClick={logout}>Log Out</Button>
            </div>
        
            <Card>
                <CardHeader>
                    <CardTitle>Manage Content</CardTitle>
                    <CardDescription>This is a protected area. More management features coming soon!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>You are successfully logged in as an administrator.</p>
                </CardContent>
            </Card>
        </div>
    );
}


export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
        <h1 className="text-2xl font-bold">Verifying admin access...</h1>
        <p className="text-muted-foreground">Please wait a moment.</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    // This is a fallback. The hook should redirect, but this is a safeguard.
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="items-center">
            <ShieldAlert className="w-12 h-12 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You do not have permission to view this page. Please log in as an administrator.</p>
            <Button onClick={() => router.push('/admin/login')}>Go to Admin Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminContent />;
}
