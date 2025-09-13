
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetLink } from '@/services/auth-service';
import { toast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MailQuestion } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await sendPasswordResetLink(values.email);
            toast({
                title: "Password Reset Email Sent",
                description: `If an account exists for ${values.email}, a reset link has been sent. Please check your inbox.`,
            });
            form.reset();
        } catch (error: any) {
            console.error("Forgot password error:", error);
            // We show a generic message to avoid confirming if an email exists or not
            toast({
                title: "Password Reset Email Sent",
                description: `If an account exists for ${values.email}, a reset link has been sent. Please check your inbox.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))] px-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                     <div className="flex justify-center mb-4">
                        <MailQuestion className="w-12 h-12 text-primary"/>
                    </div>
                    <CardTitle>Forgot Your Password?</CardTitle>
                    <CardDescription>
                        No problem. Enter your email address below and we'll send you a link to reset it.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="your.email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending...</> : "Send Reset Link"}
                            </Button>
                        </form>
                    </Form>
                     <p className="mt-6 text-sm text-center">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
