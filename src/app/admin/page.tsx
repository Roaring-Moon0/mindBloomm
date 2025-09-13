
'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { FadeIn } from '@/components/ui/fade-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SurveyManager from './components/SurveyManager';
import VideoManager from './components/VideoManager';
import UserManager from './components/UserManager';
import ConfigManager from './components/ConfigManager';


function AdminAccessDenied() {
    const router = useRouter();
    return (
        <FadeIn>
            <div className="container mx-auto py-12 px-4 md:px-6 text-center">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <ShieldAlert className="w-12 h-12 text-destructive"/>
                        </div>
                        <CardTitle>Admin Access Required</CardTitle>
                        <CardDescription>
                           Your account is not authorized to view this page. Please contact the site administrator if you believe this is an error.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={() => router.push('/')}>Return to Home</Button>
                    </CardContent>
                </Card>
            </div>
        </FadeIn>
    )
}

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


export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login?redirect=/admin');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
        <h1 className="text-2xl font-bold">Verifying access...</h1>
        <p className="text-muted-foreground">Please wait a moment.</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return <AdminDashboardContent />;
}
