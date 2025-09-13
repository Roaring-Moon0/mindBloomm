
'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/ui/fade-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SurveyManager from './components/SurveyManager';
import VideoManager from './components/VideoManager';
import UserManager from './components/UserManager';
import ConfigManager from './components/ConfigManager';
import { useAuth } from '@/hooks/use-auth';

function AdminDashboardContent() {
  const { user, logout } = useAdminAuth();

  return (
    <FadeIn>
      <div className="container mx-auto py-12 px-4 md:px-6 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">Welcome, {user?.email}.</p>
          </div>
          <Button variant="outline" onClick={logout}>Log Out</Button>
        </div>
      
        <Tabs defaultValue="surveys" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto">
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys" className="mt-6"><SurveyManager /></TabsContent>
          <TabsContent value="videos" className="mt-6"><VideoManager /></TabsContent>
          <TabsContent value="users" className="mt-6"><UserManager /></TabsContent>
          <TabsContent value="config" className="mt-6"><ConfigManager /></TabsContent>
        </Tabs>
      </div>
    </FadeIn>
  );
}

export default function AdminPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, error, verifyCode, logout } = useAdminAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const loading = authLoading || adminLoading;

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login?redirect=/admin');
    }
  }, [loading, authUser, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
        <h1 className="text-2xl font-bold">Verifying access...</h1>
        <p className="text-muted-foreground">Please wait a moment.</p>
      </div>
    );
  }
  
  if (!authUser) return null; // Redirect is handled above

  if (!isAdmin) {
    return (
       <FadeIn>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
            <Card className="max-w-md w-full">
            <CardHeader className="text-center">
                <CardTitle>Admin Verification</CardTitle>
                <CardDescription>An admin code is required to access this dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    type="text"
                    placeholder="Enter your admin code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <Button
                    onClick={async () => {
                        setVerifying(true);
                        await verifyCode(code);
                        setVerifying(false);
                    }}
                    disabled={verifying || !code}
                    className="w-full"
                >
                    {verifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</> : "Verify Code"}
                </Button>
                <Button variant="link" onClick={logout} className="w-full text-muted-foreground">Logout</Button>
            </CardContent>
            </Card>
        </div>
      </FadeIn>
    );
  }

  return <AdminDashboardContent />;
}
