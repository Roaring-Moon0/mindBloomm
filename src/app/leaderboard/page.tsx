
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Score {
  id: string;
  username: string;
  score: number;
  game: string;
  createdAt: any;
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, 'scores');
        const q = query(scoresCollection, orderBy('score', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        const scoresData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Score));
        setScores(scoresData);
      } catch (error) {
        console.error("Error fetching scores: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

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
        <CardHeader>
          <CardTitle>Top 20 Scores</CardTitle>
          <CardDescription>Scores from the Color Match game.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : scores.length > 0 ? (
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
                    No scores yet. Be the first!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
