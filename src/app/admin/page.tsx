
'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestoreDocument } from '@/hooks/use-firestore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { updateSurveyUrl } from '@/services/config-service';
import { useState } from 'react';

interface SurveyConfig {
  url: string;
}

const formSchema = z.object({
  surveyUrl: z.string().url({ message: "Please enter a valid URL." }),
});

function AdminContent() {
    const { user, logout } = useAdminAuth();
    const { data: surveyConfig, loading: docLoading, error } = useFirestoreDocument<SurveyConfig>('config/survey');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            surveyUrl: surveyConfig?.url || '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await updateSurveyUrl(values.surveyUrl);
            toast({
                title: "Success!",
                description: "The survey link has been updated.",
            });
        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update the survey link. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }


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
                    <CardDescription>Update links and other content across the site.</CardDescription>
                </CardHeader>
                <CardContent>
                    {docLoading && (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    )}
                    {error && (
                         <p className="text-destructive text-sm font-medium">Error loading content configuration.</p>
                    )}
                    {!docLoading && !error && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="surveyUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Survey Form URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://docs.google.com/forms/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                                </Button>
                            </form>
                        </Form>
                    )}
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
