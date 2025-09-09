
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Bot, Gamepad2, Library, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const quickLinks = [
    { title: "Talk to AI Assistant", description: "Get instant support and guidance.", href: "/chat", icon: <Bot className="w-8 h-8 text-primary" /> },
    { title: "Play Calming Games", description: "Relax and de-stress your mind.", href: "/games", icon: <Gamepad2 className="w-8 h-8 text-primary" /> },
    { title: "Explore Resources", description: "Find articles and guides.", href: "/resources", icon: <Library className="w-8 h-8 text-primary" /> },
];

const allQuotes = [
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

const QuoteDisplay = () => {
    const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * allQuotes.length));

    const handleChangeQuote = () => {
        setQuoteIndex(prev => (prev + 1) % allQuotes.length);
    };
    
    const currentQuote = allQuotes[quoteIndex];

    return (
        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle>Inspirational Quote</CardTitle>
                 <CardDescription>A thought for your day.</CardDescription>
            </CardHeader>
            <CardContent>
                 <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground min-h-[60px]">
                   "{currentQuote.quote}" - <cite className="font-semibold not-italic">{currentQuote.author}</cite>
                </blockquote>
                <Button onClick={handleChangeQuote} variant="link" size="sm" className="px-0 mt-2">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Quote
                </Button>
            </CardContent>
        </Card>
    )
}


export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const getInitials = (email: string | null | undefined) => {
        if (!email) return "U";
        const name = user?.displayName;
        if (name) return name.substring(0, 2).toUpperCase();
        return email.substring(0, 2).toUpperCase();
    }

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4 md:px-6">
                <Skeleton className="h-10 w-1/2 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-12" />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        );
    }
    
    if (!user) {
        // This should not happen if routing is protected, but as a fallback
        // we can redirect to login. In a real app, this would be handled by middleware.
         router.push('/login');
         return null; // Render nothing while redirecting
    }


    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Welcome back, {user?.displayName || 'Friend'}!</h1>
                <p className="mt-2 text-lg text-muted-foreground">Ready to continue your journey to a healthier mind?</p>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold font-headline mb-6">Quick Actions</h2>
                     <div className="grid gap-6 md:grid-cols-2">
                        {quickLinks.map((link) => (
                             <Link href={link.href} key={link.title}>
                                <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary/50">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        {link.icon}
                                        <CardTitle className="text-xl">{link.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{link.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-8">
                     <h2 className="text-2xl font-bold font-headline">Your Profile</h2>
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                             <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold text-lg">{user.displayName || 'Anonymous User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>

                            <Button variant="ghost" className="mt-4" onClick={logout}>Log Out</Button>
                        </CardContent>
                    </Card>

                    <QuoteDisplay />
                </div>
            </div>
        </div>
    );
}
