
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const GameSkeleton = () => (
    <div className="w-full max-w-md mx-auto">
        <Skeleton className="h-[400px] w-full" />
    </div>
)

const BreathingVisualizer = dynamic(() => import('@/components/games/BreathingVisualizer').then(mod => mod.BreathingVisualizer), {
    loading: () => <GameSkeleton />,
    ssr: false
});
const ColorMatch = dynamic(() => import('@/components/games/ColorMatch').then(mod => mod.ColorMatch), {
    loading: () => <GameSkeleton />,
    ssr: false
});
const MemoryGame = dynamic(() => import('@/components/games/MemoryGame').then(mod => mod.MemoryGame), {
    loading: () => <GameSkeleton />,
    ssr: false
});


export function GamesClient() {
    return (
        <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div className="flex justify-center">
                <BreathingVisualizer />
            </div>
            <div className="flex justify-center">
                <ColorMatch />
            </div>
            <div className="lg:col-span-2 flex justify-center">
                <MemoryGame />
            </div>
            
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-center mb-8 font-headline">More Ways to Relax</h2>
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-secondary/30 opacity-60 cursor-not-allowed">
                        <CardHeader className="items-center text-center">
                            <Music className="w-10 h-10 text-primary" />
                            <CardTitle>Sound Mixer</CardTitle>

                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground">Create your own ambient soundscape for relaxation.</p>
                            <p className="text-sm font-semibold mt-4 text-accent-foreground">(Coming Soon)</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
