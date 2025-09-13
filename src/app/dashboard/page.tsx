
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, MessageSquareHeart, RefreshCw, Loader2, UserCog } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettings from "./account-settings";

const allQuotes = [
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    quote:
      "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    quote: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
  },
  {
    quote:
      "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar",
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  }
];

function QuoteDisplay() {
  const [quoteIndex, setQuoteIndex] = useState<number | null>(null);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * allQuotes.length));
  }, []);

  const handleChangeQuote = () => {
    setQuoteIndex((prev) =>
      prev !== null ? (prev + 1) % allQuotes.length : 0
    );
  };

  const currentQuote = quoteIndex !== null ? allQuotes[quoteIndex] : null;

  return (
    <Card className="bg-gradient-to-r from-purple-100 via-pink-100 to-teal-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-teal-900/30">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Quote of the Day</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {currentQuote ? (
          <>
            <blockquote className="italic text-muted-foreground text-lg">
              "{currentQuote.quote}"
            </blockquote>
            <cite className="block font-semibold not-italic">- {currentQuote.author}</cite>
          </>
        ) : (
          <p>Loading quote...</p>
        )}
        <Button onClick={handleChangeQuote} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> New Quote
        </Button>
      </CardContent>
    </Card>
  );
}

function MainDashboard() {
    const { user } = useAuth();
    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

    return (
         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {/* Quick Links */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                    <CardDescription>Jump right back into your favorite activities.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href="/resources" passHref>
                            <Card className="h-full flex flex-col items-center justify-center p-6 text-center hover:bg-secondary hover:border-primary/50 transition-colors">
                            <BookOpen className="w-10 h-10 text-primary mb-2"/>
                            <h3 className="font-semibold">Resources</h3>
                        </Card>
                    </Link>
                    <Link href="/games" passHref>
                        <Card className="h-full flex flex-col items-center justify-center p-6 text-center hover:bg-secondary hover:border-primary/50 transition-colors">
                            <Gamepad2 className="w-10 h-10 text-primary mb-2"/>
                            <h3 className="font-semibold">Calming Games</h3>
                        </Card>
                    </Link>
                        <Link href="/chat" passHref>
                        <Card className="h-full flex flex-col items-center justify-center p-6 text-center hover:bg-secondary hover:border-primary/50 transition-colors">
                            <MessageSquareHeart className="w-10 h-10 text-primary mb-2"/>
                            <h3 className="font-semibold">Chat with Bloom</h3>
                        </Card>
                    </Link>
                </CardContent>
            </Card>

            {/* Quote of the Day */}
            <div className="lg:col-span-1">
                <QuoteDisplay />
            </div>
        </div>
    )
}


export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary"/>
            <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
            <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
    );
  }

  if (!user) {
    router.push('/login?redirect=/dashboard');
    return null;
  }
  
  const displayName = user.displayName || user.email?.split('@')[0] || 'Friend';

  return (
    <FadeIn>
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Welcome, {displayName}!</h1>
                    <p className="mt-2 text-lg text-muted-foreground">This is your personal space for calm and growth.</p>
                </div>
                <Button onClick={logout} variant="outline" className="mt-4 md:mt-0">
                    Logout
                </Button>
            </div>

            <Tabs defaultValue="dashboard" className="w-full">
                <TabsList>
                    <TabsTrigger value="dashboard">
                        <UserCog className="mr-2 h-4 w-4" />
                        Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        <UserCog className="mr-2 h-4 w-4" />
                        Account Settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard">
                    <MainDashboard />
                </TabsContent>
                <TabsContent value="settings">
                   <AccountSettings />
                </TabsContent>
            </Tabs>
        </div>
    </FadeIn>
  );
}
