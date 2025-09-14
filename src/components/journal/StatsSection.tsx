'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Note } from '@/lib/journal-utils';

interface StatsSectionProps {
    notes: Note[];
}

export function StatsSection({ notes }: StatsSectionProps) {
    const goodNotesCount = notes.filter(n => n.type === 'good').length;
    const badNotesCount = notes.filter(n => n.type === 'bad').length;

    const chartData = [
        { name: 'Good', value: goodNotesCount, fill: 'var(--color-good)' },
        { name: 'Bad', value: badNotesCount, fill: 'var(--color-bad)' },
    ];
    
    const chartConfig = {
        good: { label: 'Good', color: 'hsl(var(--chart-2))' },
        bad: { label: 'Bad', color: 'hsl(var(--destructive))' },
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notes Graph</CardTitle>
                <CardDescription>A quick overview of your good vs. bad memories.</CardDescription>
            </CardHeader>
            <CardContent>
                {notes.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No data for the graph yet.</p>
                        <p className="text-sm">Start adding notes to see your stats.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
