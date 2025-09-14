
'use client';

import type { User } from 'firebase/auth';
import { useFirestoreCollection, useFirestoreDocument } from '@/hooks/use-firestore';
import { FadeIn } from '@/components/ui/fade-in';
import { JournalTree } from '@/components/journal/JournalTree';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, AlertTriangle } from 'lucide-react';

interface JournalEntry {
    id: string;
    content: string;
    createdAt: any; // Firestore timestamp
}

interface JournalState {
    entryCount?: number;
    treeName?: string;
    lastEntryDate?: any;
}

const JournalSkeleton = () => (
    <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    </div>
)


export default function JournalClientPage({ user }: { user: User }) {
    const { data: entries, loading: entriesLoading, error: entriesError } = useFirestoreCollection<JournalEntry>(`users/${user.uid}/entries`);
    const { data: journalState, loading: stateLoading, error: stateError } = useFirestoreDocument<JournalState>(`users/${user.uid}/journal/state`);

    const loading = entriesLoading || stateLoading;
    const error = entriesError || stateError;

    return (
         <FadeIn>
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight font-headline">My Gratitude Tree</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Nurture your tree with daily moments of gratitude. Watch it grow as you do.
                    </p>
                </div>

                {loading ? (
                    <JournalSkeleton />
                ) : error ? (
                     <div className="flex flex-col items-center justify-center h-60 text-center gap-4 bg-destructive/10 rounded-lg p-4 max-w-2xl mx-auto">
                        <AlertTriangle className="w-10 h-10 text-destructive"/>
                        <p className="text-destructive font-semibold">Could not load journal.</p>
                        <p className="text-muted-foreground text-sm">
                            There was an error connecting to the database. Please try again later.
                        </p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Tree Column */}
                        <div className="lg:col-span-1">
                            <JournalTree entryCount={journalState?.entryCount || 0} treeName={journalState?.treeName} />
                        </div>

                        {/* Journal Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <JournalEditor />
                            
                            <div>
                                <h2 className="text-2xl font-bold mb-4 font-headline">Past Entries</h2>
                                {entries && entries.length > 0 ? (
                                    <div className="space-y-4">
                                        {entries.map(entry => (
                                            <JournalEntryCard key={entry.id} entry={entry} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <FileText className="mx-auto h-12 w-12"/>
                                        <p className="mt-4 font-semibold">No entries yet.</p>
                                        <p className="text-sm">Write your first entry above to plant your seed!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FadeIn>
    )
}
