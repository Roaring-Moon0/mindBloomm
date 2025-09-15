'use client';

import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { format } from 'date-fns';

// ==============================
// Interfaces
// ==============================
export interface NotePayload {
  text: string;
  type: 'good' | 'bad';
}

// ==============================
// Notes
// ==============================
export const addNote = async (payload: NotePayload) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to add a note.');

  const notesCollectionRef = collection(db, `users/${user.uid}/notes`);
  await addDoc(notesCollectionRef, {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const deleteNote = async (noteId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to delete a note.');

  const noteDocRef = doc(db, `users/${user.uid}/notes`, noteId);
  await deleteDoc(noteDocRef);
};

// ==============================
// Tree State
// ==============================
export const renameTree = async (name: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to rename the tree.');

  const treeStateRef = doc(db, `users/${user.uid}/journal/state`);
  await updateDoc(treeStateRef, { treeName: name });
};

// ==============================
// Chat
// ==============================
export const startNewChat = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to start a chat.');

  const chatsCollectionRef = collection(db, `users/${user.uid}/chats`);

  const newChatRef = await addDoc(chatsCollectionRef, {
    title: `Chat from ${format(new Date(), 'MMMM d, yyyy')}`,
    createdAt: serverTimestamp(),
    userId: user.uid,
  });

  // Add initial assistant message
  const messagesCollectionRef = collection(newChatRef, 'messages');
  await addDoc(messagesCollectionRef, {
    text: "The tree is listening. What's on your mind?",
    sender: 'assistant',
    timestamp: serverTimestamp(),
  });

  return newChatRef.id;
};

// ==============================
// Journal Entries
// ==============================
export const addJournalEntry = async (content: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to save a journal entry.');

  const journalCollectionRef = collection(db, `users/${user.uid}/journalEntries`);
  await addDoc(journalCollectionRef, {
    content,
    createdAt: serverTimestamp(),
  });
};

export const deleteJournalEntry = async (entryId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to delete a journal entry.');

  const entryDocRef = doc(db, `users/${user.uid}/journalEntries`, entryId);
  await deleteDoc(entryDocRef);
};

// ==============================
// Update Tree Name (Journal)
// ==============================
export const updateTreeName = async (name: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to update the tree name.');

  const treeStateRef = doc(db, `users/${user.uid}/journal/state`);
  await updateDoc(treeStateRef, {
    treeName: name,
  });
};