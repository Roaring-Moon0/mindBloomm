'use server';

import { auth, db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, runTransaction, getDoc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

const entrySchema = z.object({
  content: z.string().min(1, 'Content cannot be empty.'),
});

const nameSchema = z.object({
  name: z.string().min(1, 'Tree name cannot be empty.').max(50, 'Tree name is too long.'),
});

export const addNote = async (payload: {text: string, type: 'good' | 'bad'}) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in.');

    await addDoc(collection(db, "users", user.uid, "notes"), {
      text: payload.text,
      type: payload.type,
      createdAt: serverTimestamp(),
    });
};

export const renameTree = async (newName: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in.');
    if (!newName.trim()) throw new Error('Name cannot be empty.');

    // This updates the displayName at the root of the user document
    await updateDoc(doc(db, "users", user.uid), { treeName: newName });
};


export const startNewChat = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in.');
    
    const chatsRef = collection(db, "users", user.uid, "chats");
    const newChatRef = await addDoc(chatsRef, {
      title: `New Chat`,
      createdAt: serverTimestamp(),
    });

    await updateDoc(newChatRef, { title: `Chat #${newChatRef.id.substring(0,4)}...`});
    
    return newChatRef.id;
};

export const sendMessage = async (chatId: string, message: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in.');
    if (!message.trim()) throw new Error('Message cannot be empty.');

    const messagesRef = collection(db, "users", user.uid, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: message,
      sender: 'user',
      timestamp: serverTimestamp(),
    });
};


export const addJournalEntry = async (payload: z.infer<typeof entrySchema>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to add an entry.');

    const validated = entrySchema.parse(payload);
    
    const journalStateRef = doc(db, `users/${user.uid}/journal/state`);
    const newEntryRef = doc(collection(db, `users/${user.uid}/entries`));

    return runTransaction(db, async (transaction) => {
        const stateDoc = await transaction.get(journalStateRef);

        transaction.set(newEntryRef, {
            ...validated,
            createdAt: serverTimestamp(),
            uid: user.uid,
        });

        if (!stateDoc.exists()) {
            transaction.set(journalStateRef, { 
                treeName: "My Gratitude Tree",
                entryCount: 1,
                lastEntryDate: serverTimestamp()
            });
        } else {
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

    await setDoc(journalStateRef, { treeName: validated.name }, { merge: true });
};
