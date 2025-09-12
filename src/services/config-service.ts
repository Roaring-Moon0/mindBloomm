
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, runTransaction, getDoc, query, where, getDocs, writeBatch, setDoc } from 'firebase/firestore';
import { z } from 'zod';

const surveySchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

const videoSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

// --- Survey Management ---

export const addSurvey = async (payload: z.infer<typeof surveySchema>) => {
  const validatedData = surveySchema.parse(payload);
  await addDoc(collection(db, 'surveys'), { ...validatedData, createdAt: serverTimestamp(), visible: true });
};

export const deleteSurvey = async (id: string) => {
  await deleteDoc(doc(db, 'surveys', id));
};

export const updateSurvey = async (id: string, payload: Partial<z.infer<typeof surveySchema>>) => {
  await updateDoc(doc(db, 'surveys', id), payload);
};

export const toggleSurveyVisibility = async (id: string, visible: boolean) => {
  await updateDoc(doc(db, 'surveys', id), { visible });
};

// --- Video Management ---

export const addVideo = async (payload: z.infer<typeof videoSchema>) => {
    const validatedData = videoSchema.parse(payload);
    await addDoc(collection(db, 'videos'), { ...validatedData, createdAt: serverTimestamp(), visible: true });
};

export const deleteVideo = async (id: string) => {
    await deleteDoc(doc(db, 'videos', id));
};

export const updateVideo = async (id: string, payload: Partial<z.infer<typeof videoSchema>>) => {
    await updateDoc(doc(db, 'videos', id), payload);
};

export const toggleVideoVisibility = async (id: string, visible: boolean) => {
    await updateDoc(doc(db, 'videos', id), { visible });
};

// --- User Management ---

export const banUser = async (email: string) => {
  const q = query(collection(db, 'bannedUsers'), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(collection(db, 'bannedUsers'), { email, createdAt: serverTimestamp() });
  }
};

export const unbanUser = async (email: string) => {
  const q = query(collection(db, 'bannedUsers'), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  querySnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};


// --- General Config & Features ---

export const updateConfig = async (payload: { title: string; description: string }) => {
  await setDoc(doc(db, 'config', 'app'), payload, { merge: true });
};

export const addAnnouncement = async (payload: { text: string }) => {
  await addDoc(collection(db, 'announcements'), { ...payload, createdAt: serverTimestamp() });
};

export const deleteAnnouncement = async (id: string) => {
  await deleteDoc(doc(db, 'announcements', id));
};

export const toggleFeature = async (key: string, value: boolean) => {
    const featureRef = doc(db, 'config', 'features');
    await setDoc(featureRef, { [key]: value, updatedAt: serverTimestamp() }, { merge: true });
};

// This function is kept for reference but is no longer the primary method for admin checks.
// The primary logic is now in the useAdminAuth hook for better client-side state management.
export async function isApprovedAdmin(email: string): Promise<boolean> {
    try {
        const adminConfigDoc = await getDoc(doc(db, "config", "admins"));
        if (adminConfigDoc.exists()) {
            const adminEmails = adminConfigDoc.data().emails || [];
            return adminEmails.includes(email);
        }
        return false;
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}
