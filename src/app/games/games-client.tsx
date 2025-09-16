'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const GameSkeleton = ({ height = 400 }: { height?: number }) => (
    <div className="w-full max-w-md mx-auto">
        <Skeleton style={{ height: `${height}px` }} className="w-full" />
    </div>
);

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
const ZenGarden = dynamic(() => import('@/components/games/ZenGarden').then(mod => mod.ZenGarden), {
    loading: () => <GameSkeleton height={450} />,
    ssr: false
});
const PatternTracer = dynamic(() => import('@/components/games/PatternTracer').then(mod => mod.PatternTracer), {
    loading: () => <GameSkeleton height={450} />,
    ssr: false
});
const AffirmationBubbles = dynamic(() => import('@/components/games/AffirmationBubbles').then(mod => mod.AffirmationBubbles), {
    loading: () => <GameSkeleton height={450} />,
    ssr: false
});


export function GamesClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-1 md:col-span-2 flex justify-center">
                <BreathingVisualizer />
            </div>

            <div className="lg:col-span-2 md:col-span-2 flex justify-center w-full">
                <PatternTracer />
            </div>
            
            <div className="lg:col-span-2 md:col-span-1 flex justify-center w-full">
                <ZenGarden />
            </div>
            
            <div className="lg:col-span-1 md:col-span-1 flex justify-center">
                <ColorMatch />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-center w-full">
               <AffirmationBubbles />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3 flex justify-center w-full">
                <MemoryGame />
            </div>

        </div>
    )
}
