
'use client';

import type { User } from 'firebase/auth';
import { FadeIn } from '@/components/ui/fade-in';
import TreeSection from '@/components/journal/TreeSection';

export default function JournalClientPage({ uid }: { uid: string }) {
    return (
        <FadeIn>
            <div className="container mx-auto py-8">
               <TreeSection uid={uid} />
            </div>
        </FadeIn>
    )
}
