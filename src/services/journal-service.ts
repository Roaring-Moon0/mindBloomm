
'use server';

import { auth, db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, runTransaction, getDoc, Timestamp } from 'firebase/firestore';
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

    return runTransaction(db, async (transaction) => {
        const stateDoc = await transaction.get(journalStateRef);

        let entryCount = 1;
        let treeName = "My Gratitude Tree"; // Default name

        if (stateDoc.exists()) {
            const data = stateDoc.data();
            entryCount = (data.entryCount || 0) + 1;
            treeName = data.treeName || treeName;
        } else {
            // If state doc doesn't exist, create it with default name
             transaction.set(journalStateRef, { treeName, entryCount: 0, lastEntryDate: serverTimestamp() });
        }

        const newEntryRef = doc(collection(db, `users/${user.uid}/entries`));
        transaction.set(newEntryRef, {
            ...validated,
            createdAt: serverTimestamp(),
            uid: user.uid,
        });

        transaction.update(journalStateRef, { 
            entryCount: entryCount,
            lastEntryDate: serverTimestamp()
        });

        return { id: newEntryRef.id, entryCount };
    });
};

export const deleteJournalEntry = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete an entry.');

    const entryRef = doc(db, `users/${user.uid}/entries`, id);
    const journalStateRef = doc(db, `users/${user.uid}/journal/state`);

    return runTransaction(db, async (transaction) => {
        const stateDoc = await transaction.get(journalStateRef);
        if (!stateDoc.exists()) throw new Error('Journal state not found.');

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
