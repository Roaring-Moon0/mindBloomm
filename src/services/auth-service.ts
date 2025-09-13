
import { auth, db } from '@/lib/firebase';
import { 
  updateProfile as firebaseUpdateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

// --- Reauthentication ---
export const reauthenticateWithPassword = async (password: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not found or email is missing.");
    
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    return credential;
};


// --- Profile Updates ---
interface ProfileData {
  displayName: string;
}

export const updateUserProfile = async (data: ProfileData) => {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in to update your profile.");

    await firebaseUpdateProfile(user, {
        displayName: data.displayName,
    });
    
    // Also update the user's document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
        displayName: data.displayName,
    });
};


// --- Sensitive Account Actions ---

export const updateUserEmail = async (newEmail: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not found.");
    
    await verifyBeforeUpdateEmail(user, newEmail);
};


export const sendPasswordReset = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not found or email is missing.");

    await sendPasswordResetEmail(auth, user.email);
};
