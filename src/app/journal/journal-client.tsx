'use client';

import type { User } from 'firebase/auth';
import { FadeIn } from '@/components/ui/fade-in';
import TreeSection from '@/components/journal/TreeSection';

export default function JournalClientPage({ user }: { user: User }) {
    return (
        <FadeIn>
            <div className="container mx-auto py-8">
               <TreeSection user={user} />
            </div>
        </FadeIn>
    )
}
