
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
const MindPaint = dynamic(() => import('@/components/games/MindPaint').then(mod => mod.MindPaint), {
    loading: () => (
         <div className="w-full max-w-lg mx-auto">
            <Skeleton className="h-[500px] w-full" />
        </div>
    ),
    ssr: false
});


export function GamesClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="flex justify-center md:col-span-1 lg:col-span-1">
                <BreathingVisualizer />
            </div>
            <div className="lg:col-span-2 flex justify-center">
                 <MindPaint />
            </div>
            <div className="flex justify-center">
                <ColorMatch />
            </div>
            <div className="md:col-span-2 flex justify-center">
                <MemoryGame />
            </div>
        </div>
    )
}
