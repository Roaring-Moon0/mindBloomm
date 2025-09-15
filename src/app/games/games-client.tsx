
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
                 <Dialog>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-lg mx-auto text-center hover:shadow-lg transition-shadow cursor-pointer hover:bg-secondary hover:border-primary/50 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-2xl font-headline">Mind Paint</CardTitle>
                                <CardDescription>Click here to open the canvas and let your creativity flow.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6 flex-grow">
                                <Paintbrush className="w-24 h-24 text-primary" />
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-fit p-4">
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
            <div className="flex justify-center">
                <ColorMatch />
            </div>
            <div className="md:col-span-2 flex justify-center">
                <MemoryGame />
            </div>
        </div>
    )
}
