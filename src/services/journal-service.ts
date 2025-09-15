'use client';

import { db } from '@/lib/firebase';
import { 
  collection, addDoc, doc, updateDoc, serverTimestamp, setDoc, getDoc
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
