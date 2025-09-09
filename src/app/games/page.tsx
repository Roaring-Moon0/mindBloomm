import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Palette, Puzzle } from 'lucide-react';
import { BreathingVisualizer } from '@/components/games/BreathingVisualizer';

const otherGames = [
    {
        icon: <Puzzle className="w-10 h-10 text-primary" />,
        title: "Simple Puzzle",
        description: "A calming, non-stressful puzzle to focus your mind."
    },
    {
        icon: <Palette className="w-10 h-10 text-primary" />,
        title: "Color Match",
        description: "A relaxing game of matching soothing color palettes."
    },
    {
        icon: <Music className="w-10 h-10 text-primary" />,
        title: "Sound Mixer",
        description: "Create your own ambient soundscape for relaxation."
    }
];

export default function GamesPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Calming Games</h1>
                <p className="mt-4 text-lg text-muted-foreground">Relax your mind with our collection of soothing and satisfying games.</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 items-start">
                <div className="lg:col-span-2 flex justify-center">
                    <BreathingVisualizer />
                </div>
                
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-center mb-8 font-headline">More Ways to Relax</h2>
                    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
                        {otherGames.map(game => (
                            <Card key={game.title} className="bg-secondary/30 opacity-60 cursor-not-allowed">
                                <CardHeader className="items-center text-center">
                                    {game.icon}
                                    <CardTitle>{game.title}</CardTitle>

                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-muted-foreground">{game.description}</p>
                                    <p className="text-sm font-semibold mt-4 text-accent-foreground">(Coming Soon)</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
