
'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { useFirestoreDocument } from '@/hooks/use-firestore';
import { updateSurveyUrl } from '@/services/config-service';
import { FadeIn } from '@/components/ui/fade-in';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

interface SurveyConfig {
    url: string;
}

function AdminContent() {
    const { user, logout } = useAdminAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Fetch the current survey URL to populate the form
    const { data: surveyConfig, loading: surveyLoading } = useFirestoreDocument<SurveyConfig>('config/survey');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: '',
        },
    });
    
    // When the survey config is loaded from Firestore, update the form's default value
    useEffect(() => {
        if (surveyConfig?.url) {
            form.reset({ url: surveyConfig.url });
        }
    }, [surveyConfig, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await updateSurveyUrl(values.url);
            toast({
                title: "Success!",
                description: "The survey URL has been updated.",
            });
        } catch (error) {
            console.error("Failed to update survey URL:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not save the new survey URL. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <FadeIn>
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
                        <CardTitle>Manage Survey</CardTitle>
                        <CardDescription>Update the URL for the community survey displayed on the /survey page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {surveyLoading ? (
                             <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Loading current survey URL...</span>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="url"
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
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </Button>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </FadeIn>
    );
}


export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-112px)]">
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
