'use server';

import { auth, db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { format } from 'date-fns';


// --- Journal Notes ---

interface NotePayload {
  text: string;
  type: 'good' | 'bad';
}

export const addNote = async (payload: NotePayload, uid: string) => {
  if (!uid) throw new Error('You must be logged in to add a note.');
  const notesCollectionRef = collection(db, `users/${uid}/notes`);
  await addDoc(notesCollectionRef, {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

// --- Tree State ---

export const renameTree = async (name: string, uid: string) => {
  if (!uid) throw new Error('You must be logged in to rename the tree.');
  const treeStateRef = doc(db, `users/${uid}/journal/state`);
  await updateDoc(treeStateRef, { treeName: name });
};


// --- Chat ---

export const startNewChat = async (uid: string) => {
    if (!uid) throw new Error('You must be logged in to start a chat.');
    const chatsCollectionRef = collection(db, `users/${uid}/chats`);
    
    // Create a new chat document
    const newChatRef = await addDoc(chatsCollectionRef, {
        title: `Chat from ${format(new Date(), 'MMMM d, yyyy')}`,
        createdAt: serverTimestamp(),
        userId: uid,
    });
    
    // Add the initial assistant message to this new chat
    const messagesCollectionRef = collection(newChatRef, 'messages');
    await addDoc(messagesCollectionRef, {
        text: "The tree is listening. What's on your mind?",
        sender: 'assistant',
        timestamp: serverTimestamp(),
    });
};

export const addJournalEntry = async (payload: { content: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to save an entry.');

    const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
    await addDoc(journalCollectionRef, {
        content: payload.content,
        createdAt: serverTimestamp(),
    });
};


export const deleteJournalEntry = async (entryId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete an entry.');

    const entryDocRef = doc(db, 'users', user.uid, 'journalEntries', entryId);
    await deleteDoc(entryDocRef);
};


export const updateTreeName = async (payload: { name: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to update the tree name.');
    
    const treeStateRef = doc(db, `users/${user.uid}/journal/state`);
    await updateDoc(treeStateRef, {
        treeName: payload.name,
    });
};
