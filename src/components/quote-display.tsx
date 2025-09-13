"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const allQuotes = [
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
    { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { quote: "Sometimes later becomes never. Do it now.", author: "Unknown" },
    { quote: "Great things never come from comfort zones.", author: "Unknown" },
    { quote: "Dream it. Wish it. Do it.", author: "Unknown" },
    { quote: "Success doesn’t just find you. You have to go out and get it.", author: "Unknown" },
    { quote: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "Unknown" }
];

export default function QuoteDisplay() {
    const [quoteIndex, setQuoteIndex] = useState<number | null>(null);

    useEffect(() => {
        // Set quote only on the client to avoid hydration mismatch
        setQuoteIndex(Math.floor(Math.random() * allQuotes.length));
    }, []);

    const handleChangeQuote = () => {
        setQuoteIndex(prev => (prev !== null ? (prev + 1) % allQuotes.length : 0));
    };
    
    const currentQuote = quoteIndex !== null ? allQuotes[quoteIndex] : null;

    return (
         <div>
            <h3 className="font-semibold text-xl mb-4">Inspirational Quote</h3>
            <div className="space-y-4">
                <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground min-h-[60px]">
                   {currentQuote ? `"${currentQuote.quote}" - ` : <Skeleton className="h-5 w-3/4" />}
                   {currentQuote && <cite className="font-semibold not-italic">{currentQuote.author}</cite>}
                </blockquote>
                <Button onClick={handleChangeQuote} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Quote
                </Button>
            </div>
        </div>
    )
}