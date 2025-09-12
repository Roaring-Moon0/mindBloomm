
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


// --- Admin Access ---

const ADMIN_CODES = {
    'bl00m-adm-8c2e': { claimedBy: null },
    'bl00m-adm-f9b1': { claimedBy: null },
    'bl00m-adm-4a7d': { claimedBy: null },
    'bl00m-adm-e6f3': { claimedBy: null },
    'bl00m-adm-9b5h': { claimedBy: null },
    'bl00m-adm-2k8g': { claimedBy: null },
};

export async function verifyAndClaimAdminCode(userId: string, code: string): Promise<boolean> {
  const adminCodesRef = doc(db, 'config', 'adminCodes');
  
  try {
    return await runTransaction(db, async (transaction) => {
      const adminCodesDoc = await transaction.get(adminCodesRef);

      if (!adminCodesDoc.exists()) {
        // If the document doesn't exist, create it with the first claim
        const newCodeData = { ...ADMIN_CODES, [code]: { claimedBy: userId } };
        transaction.set(adminCodesRef, newCodeData);
        return Object.keys(ADMIN_CODES).includes(code);
      }

      const codes = adminCodesDoc.data();
      
      // Check if any code has been claimed by this user already
      for (const key in codes) {
        if (codes[key].claimedBy === userId) {
            // If the code they entered is the one they claimed, it's valid
            if (key === code) return true;
        }
      }

      const codeData = codes[code];

      if (!codeData) return false; // Code doesn't exist
      if (codeData.claimedBy && codeData.claimedBy !== userId) return false; // Code claimed by someone else

      // Claim the code
      transaction.update(adminCodesRef, {
        [`${code}.claimedBy`]: userId,
      });
      
      return true;
    });
  } catch (error) {
    console.error("Error in verifyAndClaimAdminCode transaction:", error);
    return false;
  }
}

export async function isApprovedAdmin(email: string): Promise<boolean> {
    const approvedEmails = [
        'watervolt69@gmail.com',
        'gauravxns001@gmail.com',
        'kartiksharmaa2066@gmail.com',
        'anubhavahluwalia02@gmail.com',
        'shivimehta2008@gmail.com',
        'ruhikumari2672@gmail.com',
    ];
    return approvedEmails.includes(email);
}
