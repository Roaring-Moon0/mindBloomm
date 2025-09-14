
'use server';

import { auth, db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, runTransaction, getDoc, Timestamp, setDoc } from 'firebase/firestore';
import { z } from 'zod';

const entrySchema = z.object({
  content: z.string().min(1, 'Content cannot be empty.'),
});

const nameSchema = z.object({
  name: z.string().min(1, 'Tree name cannot be empty.').max(50, 'Tree name is too long.'),
});

export const addJournalEntry = async (payload: z.infer<typeof entrySchema>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to add an entry.');

    const validated = entrySchema.parse(payload);
    
    const journalStateRef = doc(db, `users/${user.uid}/journal/state`);
    const newEntryRef = doc(collection(db, `users/${user.uid}/entries`));

    return runTransaction(db, async (transaction) => {
        const stateDoc = await transaction.get(journalStateRef);

        // Add the new journal entry
        transaction.set(newEntryRef, {
            ...validated,
            createdAt: serverTimestamp(),
            uid: user.uid,
        });

        // If the journal state doesn't exist, create it.
        if (!stateDoc.exists()) {
            transaction.set(journalStateRef, { 
                treeName: "My Gratitude Tree",
                entryCount: 1,
                lastEntryDate: serverTimestamp()
            });
        } else {
            // Otherwise, increment the entry count.
            const newCount = (stateDoc.data().entryCount || 0) + 1;
            transaction.update(journalStateRef, { 
                entryCount: newCount,
                lastEntryDate: serverTimestamp()
            });
        }
    });
};

export const deleteJournalEntry = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete an entry.');

    const entryRef = doc(db, `users/${user.uid}/entries`, id);
    const journalStateRef = doc(db, `users/${user.uid}/journal/state`);

    return runTransaction(db, async (transaction) => {
        const stateDoc = await transaction.get(journalStateRef);
        if (!stateDoc.exists()) {
            // If for some reason the state doc doesn't exist, we can just delete the entry
            transaction.delete(entryRef);
            return;
        };

        const currentCount = stateDoc.data().entryCount || 0;
        
        transaction.delete(entryRef);
        transaction.update(journalStateRef, { entryCount: Math.max(0, currentCount - 1) });
    });
};

export const updateTreeName = async (payload: z.infer<typeof nameSchema>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to update the tree name.');
    
    const validated = nameSchema.parse(payload);
    const journalStateRef = doc(db, `users/${user.uid}/journal/state`);

    // Use set with merge:true to create the doc if it doesn't exist
    await setDoc(journalStateRef, { treeName: validated.name }, { merge: true });
};
