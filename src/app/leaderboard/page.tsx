
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Score {
  id: string;
  username: string;
  score: number;
  game: string;
  createdAt: any;
}

const gameOptions = [
    { value: 'ColorMatch', label: 'Color Match' },
    { value: 'MemoryGame', label: 'Memory Game' },
];

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('ColorMatch');

  useEffect(() => {
    if (authLoading) {
      return; 
    }

    if (!user) {
      router.push('/login');
      return;
    }
    
    setLoading(true);
    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, 'scores');
        // This query requires a composite index on 'game' and 'score'.
        // Firebase will provide a link in the browser console to create it automatically.
        const q = query(
            scoresCollection, 
            where('game', '==', selectedGame),
            orderBy('score', 'desc'), 
            limit(20)
        );
        const querySnapshot = await getDocs(q);
        const scoresData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Score));
        setScores(scoresData);
      } catch (error) {
        console.error("Error fetching scores: ", error);
        // This is where you will see the error in the console with a link to create the index.
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [user, authLoading, router, selectedGame]);

  if (authLoading) {
     return <SkeletonPage />;
  }

  if (!user) {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You must be logged in to view the leaderboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/login')}>
                        <LogIn className="mr-2 h-4 w-4" /> Go to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline flex items-center justify-center gap-4">
          <Trophy className="w-10 h-10 text-primary" />
          Leaderboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">See who has the top scores in our calming games.</p>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex-row items-center justify-between">
            <div>
                 <CardTitle>Top 20 Scores</CardTitle>
                 <CardDescription>Scores from the {gameOptions.find(g => g.value === selectedGame)?.label} game.</CardDescription>
            </div>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                    {gameOptions.map(game => (
                        <SelectItem key={game.value} value={game.value}>{game.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </CardHeader>
        <CardContent>
            {loading ? (
                <SkeletonTable />
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {scores.length > 0 ? (
                        scores.map((score, index) => (
                        <TableRow key={score.id}>
                            <TableCell className="font-bold">{index + 1}</TableCell>
                            <TableCell>{score.username}</TableCell>
                            <TableCell>{score.score}</TableCell>
                            <TableCell className="text-right">
                            {score.createdAt ? new Date(score.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            No scores yet for this game. Be the first!
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}


const SkeletonPage = () => (
     <div className="container mx-auto py-12 px-4 md:px-6">
         <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight font-headline flex items-center justify-center gap-4">
            <Trophy className="w-10 h-10 text-primary" />
            Leaderboard
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">See who has the top scores in our calming games.</p>
        </div>
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Top 20 Scores</CardTitle>
                <CardDescription>Loading scores...</CardDescription>
            </CardHeader>
            <CardContent>
                 <SkeletonTable />
            </CardContent>
        </Card>
    </div>
)

const SkeletonTable = () => (
    <Table>
        <TableHeader>
        <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Date</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-24" /></TableCell>
            </TableRow>
        ))}
        </TableBody>
    </Table>
)
