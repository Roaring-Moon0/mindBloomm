import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GamesClient } from './games-client';

export default function GamesPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Calming Games</h1>
                <p className="mt-4 text-lg text-muted-foreground">Relax your mind with our collection of soothing and satisfying games.</p>
            </div>

            <GamesClient />
        </div>
    );
}
