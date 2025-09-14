
'use client';

import type { User } from 'firebase/auth';
import { useFirestoreCollection, useFirestoreDocument } from '@/hooks/use-firestore';
import { FadeIn } from '@/components/ui/fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { TreeSection } from '@/components/journal/TreeSection';
import { NotesSection } from '@/components/journal/NotesSection';
import { StatsSection } from '@/components/journal/StatsSection';
import type { Note, Journal } from '@/lib/journal-utils';

const JournalSkeleton = () => (
    <div className="grid lg:grid-cols-3 gap-8 p-4 md:p-8">
        <div className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-8">
            <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    </div>
)

export default function JournalClientPage({ user }: { user: User }) {
    // Conditionally set paths to prevent hooks from running before user is authenticated
    const notesPath = user ? `users/${user.uid}/notes` : '';
    const journalPath = user ? `users/${user.uid}/journal/state` : '';

    const { data: notes, loading: notesLoading, error: notesError } = useFirestoreCollection<Note>(notesPath);
    const { data: journal, loading: journalLoading, error: journalError } = useFirestoreDocument<Journal>(journalPath);

    const loading = notesLoading || journalLoading;
    const error = notesError || journalError;

    const goodNotes = notes?.filter(n => n.type === 'good') || [];
    const badNotes = notes?.filter(n => n.type === 'bad') || [];

    return (
        <FadeIn>
            <div className="container mx-auto py-8">
                {loading ? (
                    <JournalSkeleton />
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center gap-4 bg-destructive/10 rounded-lg p-4 max-w-2xl mx-auto">
                        <AlertTriangle className="w-10 h-10 text-destructive"/>
                        <p className="text-destructive font-semibold">Could not load your journal.</p>
                        <p className="text-muted-foreground text-sm">
                            There was an error connecting to the database. Please check your connection and try again later.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <NotesSection title="Bad Memories" notes={badNotes} type="bad" />
                            <StatsSection notes={notes || []} />
                        </div>

                        {/* Center Column */}
                        <TreeSection journal={journal} />

                        {/* Right Column */}
                        <div className="space-y-8">
                            <NotesSection title="Good Memories" notes={goodNotes} type="good" />
                            {/* Tree AI Chat can go here in a future update */}
                        </div>
                    </div>
                )}
            </div>
        </FadeIn>
    )
}
