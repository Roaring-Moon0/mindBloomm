
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Paintbrush } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

const GameSkeleton = ({ height = 400 }: { height?: number }) => (
    <div className="w-full max-w-md mx-auto">
        <Skeleton className="w-full" style={{ height: `${height}px` }}/>
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
const MindPaint = dynamic(() => import('@/components/games/MindPaint').then(mod => mod.MindPaint), {
    loading: () => <GameSkeleton height={500} />,
    ssr: false
});


export function GamesClient() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start">
            
            {/* Breathing Visualizer */}
            <div className="flex justify-center sm:col-span-1">
                <BreathingVisualizer />
            </div>

            {/* Mind Paint */}
            <div className="flex justify-center sm:col-span-2 lg:col-span-2 w-full">
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-lg text-center hover:shadow-lg transition-shadow cursor-pointer hover:bg-secondary hover:border-primary/50 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-2xl font-headline">Mind Paint</CardTitle>
                                <CardDescription>Click here to open the canvas and let your creativity flow.</CardDescription>
                            </CardHeader>
                             <CardContent className="flex flex-col items-center justify-center p-6 flex-grow">
                                <Paintbrush className="w-32 h-32 text-primary" />
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] flex flex-col p-4">
                        <VisuallyHidden>
                            <DialogHeader>
                                <DialogTitle>Mind Paint Game</DialogTitle>
                                <DialogDescription>A digital canvas to draw freely and express your creativity. Use the controls to change colors, adjust brush size, or clear the canvas.</DialogDescription>
                            </DialogHeader>
                        </VisuallyHidden>
                        <MindPaint />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Color Match */}
            <div className="flex justify-center sm:col-span-1">
                <ColorMatch />
            </div>

            {/* Memory Game */}
            <div className="flex justify-center col-span-1 sm:col-span-2 lg:col-span-3 w-full">
                <MemoryGame />
            </div>

        </div>
    )
}
