
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
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Meet Bloom</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Your friendly AI companion for personalized support.</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                        <CardContent className="h-[70vh] flex flex-col p-0">
                            <ChatUI />
                        </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-8">
                        <Card className="bg-destructive/20 border-destructive/50">
                            <CardHeader className="flex flex-row items-center gap-2">
                                <ShieldAlert className="w-6 h-6 text-destructive" />
                                <CardTitle>Important Disclaimer</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-destructive/90 font-medium">
                                <p>Bloom is an AI and not a substitute for professional medical advice, diagnosis, or treatment.</p>
                                <p className="mt-2">If you are in a crisis, please seek help immediately.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-2">
                                <Phone className="w-6 h-6 text-primary" />
                                <CardTitle>Indian Emergency Resources</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><span className="font-semibold">KIRAN Mental Health Helpline:</span> Call 1800-599-0019</p>
                                <p><span className="font-semibold">Vandrevala Foundation:</span> Call 1860-266-2345</p>
                                <p><span className="font-semibold">iCall (TISS):</span> Call 9152987821</p>
                                <p><span className="font-semibold">National Emergency Number:</span> Call 112</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FadeIn>
    )
}
