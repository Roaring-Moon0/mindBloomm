'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TreeSection from '@/components/journal/TreeSection';

function JournalClientPage({ uid }: { uid: string }) {
    return (
        <FadeIn>
            <div className="container mx-auto py-8">
               <TreeSection uid={uid} />
            </div>
        </FadeIn>
    )
}


export default function JournalPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center text-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary"/>
                <h1 className="text-2xl font-bold">Loading Your Journal...</h1>
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
                            <p>You need to be logged in to view your Tree Journal.</p>
                            <Button asChild>
                                <Link href="/login?redirect=/journal">Login to View Journal</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </FadeIn>
        )
    }

    return <JournalClientPage uid={user.uid} />;
}
