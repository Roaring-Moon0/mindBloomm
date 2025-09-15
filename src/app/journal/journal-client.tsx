
'use client';

import type { User } from 'firebase/auth';
import { useFirestoreCollection, useFirestoreDocument } from '@/hooks/use-firestore';
import { FadeIn } from '@/components/ui/fade-in';
import { JournalTree } from '@/components/journal/JournalTree';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { Loader2, BookOpen } from 'lucide-react';

interface JournalEntry {
    id: string;
    content: string;
    createdAt: any;
}

interface TreeState {
    treeName?: string;
}

export default function JournalClientPage({ user }: { user: User }) {
    const { data: entries, loading: entriesLoading } = useFirestoreCollection<JournalEntry>(`users/${user.uid}/journalEntries`);
    const { data: treeState, loading: treeStateLoading } = useFirestoreDocument<TreeState>(`users/${user.uid}/journal/state`);

    const loading = entriesLoading || treeStateLoading;

    return (
        <FadeIn>
            <div className="container mx-auto py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin"/></div>
                        ) : (
                            <JournalTree entryCount={entries?.length || 0} treeName={treeState?.treeName} />
                        )}
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <JournalEditor />
                        
                        <h2 className="text-2xl font-bold font-headline">Recent Entries</h2>
                        {loading ? (
                            <div className="text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin inline-block mr-2"/>Loading entries...</div>
                        ) : entries && entries.length > 0 ? (
                            <div className="space-y-4">
                                {entries.map(entry => (
                                    <JournalEntryCard key={entry.id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground rounded-lg bg-secondary/50">
                                <BookOpen className="mx-auto h-12 w-12"/>
                                <p className="mt-4 font-semibold">No entries yet.</p>
                                <p className="text-sm">Write your first journal entry above to start growing your tree!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FadeIn>
    )
}
