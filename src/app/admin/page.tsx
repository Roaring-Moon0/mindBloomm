
'use client';

import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, KeyRound, PlusCircle, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { useFirestoreCollection } from '@/hooks/use-firestore';
import { addSurvey, deleteSurvey } from '@/services/config-service';
import { FadeIn } from '@/components/ui/fade-in';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const addSurveyFormSchema = z.object({
  name: z.string().min(3, { message: "Survey name must be at least 3 characters." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
});

const codeFormSchema = z.object({
    adminCode: z.string().min(4, { message: "Please enter your unique admin code." }),
});

export interface SurveyConfig {
    id: string;
    name: string;
    url: string;
    createdAt: any;
}


function AdminVerificationGate() {
    const { verifyAdminCode, isVerifying } = useAdminAuth();

    const form = useForm<z.infer<typeof codeFormSchema>>({
        resolver: zodResolver(codeFormSchema),
        defaultValues: { adminCode: "" },
    });

    async function onSubmit(values: z.infer<typeof codeFormSchema>) {
        const success = await verifyAdminCode(values.adminCode);
        if (success) {
             toast({
                title: "Access Granted!",
                description: "Welcome to the admin dashboard.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Verification Failed",
                description: "The admin code is invalid or has already been claimed.",
            });
        }
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
                           To access the dashboard, first sign up or log in, then enter your unique admin code here.
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: surveys, loading: surveysLoading } = useFirestoreCollection<SurveyConfig>('surveys');

    const form = useForm<z.infer<typeof addSurveyFormSchema>>({
        resolver: zodResolver(addSurveyFormSchema),
        defaultValues: { name: '', url: '' },
    });

    async function onAddSurveySubmit(values: z.infer<typeof addSurveyFormSchema>) {
        setIsSubmitting(true);
        try {
            await addSurvey(values);
            toast({
                title: "Success!",
                description: "The new survey has been added.",
            });
            form.reset();
        } catch (error) {
            console.error("Failed to add survey:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not save the new survey. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDeleteSurvey = async (id: string) => {
        if (!confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteSurvey(id);
             toast({
                title: "Survey Deleted",
                description: "The survey has been successfully removed.",
            });
        } catch (error) {
            console.error("Failed to delete survey:", error);
             toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "Could not delete the survey. Please try again.",
            });
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
            
                <div className="grid gap-12 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Survey</CardTitle>
                            <CardDescription>Add a new survey to be displayed on the /survey page.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onAddSurveySubmit)} className="space-y-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Survey Name</FormLabel>
                                            <FormControl><Input placeholder="e.g., 'Campus Mental Health Check'" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="url" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Survey Form URL</FormLabel>
                                            <FormControl><Input placeholder="https://docs.google.com/forms/..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : <><PlusCircle className="mr-2 h-4 w-4" /> Add Survey</>}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Manage Existing Surveys</CardTitle>
                            <CardDescription>View and remove current surveys.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {surveysLoading ? (
                                 <div className="flex items-center gap-2 text-muted-foreground justify-center py-10">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading surveys...</span>
                                </div>
                            ) : (surveys && surveys.length > 0) ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {surveys.map((survey) => (
                                            <TableRow key={survey.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={survey.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {survey.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSurvey(survey.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>No surveys found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FadeIn>
    );
}


export default function AdminDashboardPage() {
  const { user, isAdmin, loading, isVerifying } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
        // If not loading and not logged in, redirect to login page.
        // Pass a redirect parameter to come back here after login.
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
    // This is a fallback state while redirecting, should not be visible for long.
    return null;
  }

  // If the user is logged in, but not an admin, show the verification gate to enter a code.
  if (!isAdmin) {
    return <AdminVerificationGate />;
  }

  // If all checks pass (user is logged in and is an admin), show the dashboard.
  return <AdminDashboardContent />;
}
