import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreathingVisualizer } from '@/components/games/BreathingVisualizer';
import { ColorMatch } from '@/components/games/ColorMatch';
import { MemoryGame } from '@/components/games/MemoryGame';
import { Music, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GamesPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Calming Games</h1>
                <p className="mt-4 text-lg text-muted-foreground">Relax your mind with our collection of soothing and satisfying games.</p>
                <div className="mt-6">
                    <Button asChild>
                        <Link href="/leaderboard">
                            <Trophy className="mr-2 h-5 w-5" /> View Leaderboard
                        </Link>
                    </Button>
                </div>
            </div>

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
        </div>
    );
}
