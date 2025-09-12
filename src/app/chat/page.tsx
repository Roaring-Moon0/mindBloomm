
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, ShieldAlert, Loader2 } from "lucide-react";
import { ChatUI } from './chat-ui';
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";

export default function ChatPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center text-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary"/>
                <h1 className="text-2xl font-bold">Checking authentication...</h1>
                <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
        )
    }

    if (!user) {
        return (
            <FadeIn>
                <div className="container mx-auto py-12 px-4 md:px-6 text-center min-h-screen flex items-center justify-center">
                    <Card className="max-w-lg mx-auto">
                        <CardHeader>
                            <CardTitle>Access Denied</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>You need to be logged in to chat with Bloom.</p>
                            <Button asChild>
                            <Link href="/login">Login to Chat</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </FadeIn>
        )
    }

    return (
        <FadeIn className="h-full">
            <div className="flex flex-col md:flex-row h-screen">
                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="md:hidden text-center p-4 border-b">
                        <h1 className="text-xl font-bold tracking-tight font-headline">Chat with Bloom</h1>
                    </div>
                    <ChatUI />
                </div>
                {/* Sidebar */}
                <aside className="hidden md:block w-full md:w-80 lg:w-96 p-6 border-l space-y-8 bg-secondary/30 overflow-y-auto">
                     <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight font-headline">Meet Bloom</h1>
                        <p className="mt-2 text-md text-muted-foreground">Your AI companion for when you need a listening ear or gentle guidance. Bloom is here to support you, not to replace professional help.</p>
                    </div>
                    <Card className="bg-destructive/20 border-destructive/50">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-destructive flex-shrink-0" />
                            <CardTitle className="text-lg">This is not a substitute for professional help</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-destructive/90 font-medium">
                            <p>Bloom is an AI. If you are in a crisis, feeling overwhelmed, or in danger, please use one of the emergency numbers listed below immediately. They are trained to help.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <Phone className="w-6 h-6 text-primary" />
                            <CardTitle>Emergency Helplines (India)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                           <p><span className="font-semibold">National Emergency Number:</span> Call 112</p>
                           <p><span className="font-semibold">National Health Helpline:</span> Call 1800-180-1104</p>
                           <div>
                                <p className="font-semibold">KIRAN Mental Health Helpline</p>
                                <p className="text-muted-foreground">A 24/7 national helpline for anyone experiencing anxiety, stress, depression, or other mental health concerns.</p>
                                <p className="font-medium text-primary">Call 1800-599-0019</p>
                           </div>
                            <div>
                                <p className="font-semibold">Aasra</p>
                                <p className="text-muted-foreground">A 24/7 helpline for those who are feeling distressed, lonely, or suicidal.</p>
                                <p className="font-medium text-primary">Call +91-9820466726</p>
                           </div>
                           <div>
                                <p className="font-semibold">Vandrevala Foundation</p>
                                <p className="text-muted-foreground">A 24/7 helpline providing counseling for mental health and emotional distress.</p>
                                <p className="font-medium text-primary">Call 1860-266-2345</p>
                           </div>
                           <div>
                                <p className="font-semibold">Samaritans Mumbai</p>
                                <p className="text-muted-foreground">Provides emotional support for the distressed or suicidal. (3 PM - 9 PM daily)</p>
                                <p className="font-medium text-primary">Call +91 84229 84528</p>
                           </div>
                            <div>
                                <p className="font-semibold">iCall (TISS)</p>
                                <p className="text-muted-foreground">Offers free counseling by trained professionals. (Mon-Sat, 10 AM - 8 PM)</p>
                                <p className="font-medium text-primary">Call 9152987821</p>
                           </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </FadeIn>
    )
}
