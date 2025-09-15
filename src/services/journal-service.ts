
'use server';

import { auth, db } from '@/lib/firebase';
import { collection, addDoc, doc, serverTimestamp, runTransaction, query, where, getDocs, writeBatch, deleteDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const noteSchema = z.object({
  content: z.string().min(10, 'Note must be at least 10 characters.'),
  type: z.enum(['good', 'bad']),
});

const nameSchema = z.object({
  name: z.string().min(1, 'Tree name cannot be empty.').max(50, 'Tree name is too long.'),
});

export const addNote = async (payload: z.infer<typeof noteSchema>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to add a note.');

    console.log("Saving note for:", user.uid); // Debugging as per user suggestion
    const validated = noteSchema.parse(payload);
    
    const journalStateRef = doc(db, `users/${user.uid}/journal/state`);
    const newNoteRef = doc(db, `users/${user.uid}/notes/${Date.now()}`);

    await runTransaction(db, async (transaction) => {
        const stateDoc = await transaction.get(journalStateRef);

        // Add the new note
        transaction.set(newNoteRef, {
            ...validated,
            createdAt: serverTimestamp(),
        });

        const healthChange = validated.type === 'good' ? 5 : -2;

        if (!stateDoc.exists()) {
            transaction.set(journalStateRef, { 
                treeName: "My Tree",
                createdAt: serverTimestamp(),
                lastWritten: serverTimestamp(),
                treeHealth: 80 + healthChange,
                missedDays: 0,
                mood: 'happy',
                emoji: '😊',
            });
        } else {
            const currentHealth = stateDoc.data().treeHealth || 80;
            const newHealth = Math.min(100, Math.max(0, currentHealth + healthChange));
            let newMood = 'happy';
            let newEmoji = '😊';

            if (newHealth < 40) {
                newMood = 'sad';
                newEmoji = '😢';
            } else if (newHealth < 70) {
                newMood = 'neutral';
                newEmoji = '😐';
            }

            transaction.update(journalStateRef, { 
                lastWritten: serverTimestamp(),
                treeHealth: newHealth,
                mood: newMood,
                emoji: newEmoji,
            });
        }
    });

    revalidatePath('/journal');
};

export const deleteNote = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete a note.');

    const noteRef = doc(db, `users/${user.uid}/notes`, id);
    await deleteDoc(noteRef);

    revalidatePath('/journal');
}

export const updateTreeName = async (payload: z.infer<typeof nameSchema>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to update the tree name.');
    
    const validated = nameSchema.parse(payload);
    const journalStateRef = doc(db, `users/${user.uid}/journal/state`);

    await setDoc(journalStateRef, { treeName: validated.name }, { merge: true });

    revalidatePath('/journal');
};
