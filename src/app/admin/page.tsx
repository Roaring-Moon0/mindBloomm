
'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { FadeIn } from '@/components/ui/fade-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SurveyManager from './components/SurveyManager';
import VideoManager from './components/VideoManager';
import UserManager from './components/UserManager';
import ConfigManager from './components/ConfigManager';


const codeFormSchema = z.object({
    adminCode: z.string().min(4, { message: "Please enter your unique admin code." }),
});


function AdminVerificationGate() {
    const { verifyAdmin, isVerifying } = useAdminAuth();

    const form = useForm<z.infer<typeof codeFormSchema>>({
        resolver: zodResolver(codeFormSchema),
        defaultValues: { adminCode: "" },
    });

    async function onSubmit(values: z.infer<typeof codeFormSchema>) {
        const success = await verifyAdmin(values.adminCode);
        if (success) {
             toast({
                title: "Access Granted!",
                description: "Welcome to the admin dashboard.",
            });
        }
        // Specific failure toasts are handled inside the verifyAdmin function now
    }

    return (
        <FadeIn>
            <div className="container mx-auto py-12 px-4 md:px-6 text-center">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <KeyRound className="w-12 h-12 text-primary"/>
                        </div>
                        <CardTitle>Admin Verification Required</CardTitle>
                        <CardDescription>
                           To access the dashboard, first sign in with an approved account, then enter your unique admin code here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                                <FormField
                                    control={form.control}
                                    name="adminCode"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Code</FormLabel>
                                        <FormControl>
                                        <Input placeholder="bl00m-adm-xxxx" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isVerifying}>
                                    {isVerifying ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>) : "Verify and Enter"}
                                </Button>
                            </form>
                        </Form>
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
  const { user, isAdmin, loading, isVerifying } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login?redirect=/admin');
    }
  }, [loading, user, router]);

  if (loading || isVerifying) {
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
    return <AdminVerificationGate />;
  }

  return <AdminDashboardContent />;
}
