
'use client';

import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, doc, updateDoc, serverTimestamp, setDoc, getDoc, deleteDoc
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

// --- Add Note ---
export const addNote = async (payload: { text: string; type: 'good' | 'bad' }, user: User) => {
  if (!user) throw new Error('You must be logged in.');

  await addDoc(collection(db, "users", user.uid, "notes"), {
    text: payload.text,
    type: payload.type,
    createdAt: serverTimestamp(),
  });
};

// --- Rename Tree ---
export const renameTree = async (newName: string, user: User) => {
  if (!user) throw new Error('You must be logged in.');

  const journalStateRef = doc(db, `users/${user.uid}/journal/state`);
  // Use set with merge:true to create the document if it doesn't exist, or update it if it does.
  await setDoc(journalStateRef, { treeName: newName }, { merge: true });
};

// --- Start New Chat ---
export const startNewChat = async (user: User) => {
    if (!user) throw new Error('You must be logged in.');
    
    const chatsRef = collection(db, "users", user.uid, "chats");
    const newChatRef = await addDoc(chatsRef, {
      title: `New Chat`,
      createdAt: serverTimestamp(),
    });

    // Generate a more descriptive title
    await updateDoc(newChatRef, { title: `Chat #${newChatRef.id.substring(0,4)}...`});
    
    return newChatRef.id;
};

export const addJournalEntry = async (payload: { content: string }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to add an entry.");

  const entriesRef = collection(db, 'users', user.uid, 'journalEntries');
  await addDoc(entriesRef, {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const deleteJournalEntry = async (entryId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in to delete an entry.");

    const entryRef = doc(db, 'users', user.uid, 'journalEntries', entryId);
    await deleteDoc(entryRef);
}

export const updateTreeName = async (payload: { name: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in to update the tree name.");
    
    const journalRef = doc(db, 'users', user.uid, 'journal', 'state');
    await setDoc(journalRef, payload, { merge: true });
}
