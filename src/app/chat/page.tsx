
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary"/>
                <h1 className="text-2xl font-bold">Checking authentication...</h1>
                <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
        )
    }

    if (!user) {
        return (
            <FadeIn>
                <div className="container mx-auto py-12 px-4 md:px-6 text-center">
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
        <FadeIn>
            <div className="flex flex-col md:flex-row h-[calc(100vh-57px)]">
                <div className="flex-1 flex flex-col">
                    <div className="md:hidden text-center p-4 border-b">
                        <h1 className="text-xl font-bold tracking-tight font-headline">Chat with Bloom</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ChatUI />
                    </div>
                </div>
                <div className="hidden md:block md:w-1/3 lg:w-1/4 p-6 border-l space-y-8 bg-secondary/30 overflow-y-auto">
                     <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight font-headline">Meet Bloom</h1>
                        <p className="mt-2 text-md text-muted-foreground">Your friendly AI companion for when you need a listening ear or gentle guidance.</p>
                    </div>
                    <Card className="bg-destructive/20 border-destructive/50">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <ShieldAlert className="w-6 h-6 text-destructive" />
                            <CardTitle>In Crisis? Seek Help</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-destructive/90 font-medium">
                            <p>Bloom is an AI assistant and cannot provide medical advice. It is not a substitute for a professional therapist.</p>
                            <p className="mt-2">If you are in a crisis or feel you are in danger, please use the emergency numbers in the footer immediately.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Phone className="w-6 h-6 text-primary" />
                            <CardTitle>Indian Emergency Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p><span className="font-semibold">National Emergency Number:</span> Call 112</p>
                            <p><span className="font-semibold">KIRAN Mental Health Helpline:</span> Call 1800-599-0019 (24/7)</p>
                            <p><span className="font-semibold">Aasra:</span> Call +91-9820466726 (24/7)</p>
                            <p><span className="font-semibold">Vandrevala Foundation:</span> Call 1860-266-2345 (24/7)</p>
                             <p><span className="font-semibold">Samaritans Mumbai:</span> Call +91 84229 84528 (3 PM - 9 PM)</p>
                            <p><span className="font-semibold">iCall (TISS):</span> Call 9152987821 (Mon-Sat, 10 AM - 8 PM)</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FadeIn>
    )
}
