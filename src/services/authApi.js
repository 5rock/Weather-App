import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export const getFriendlyAuthError = (errorCode) => {
  switch (errorCode) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address but different sign-in credentials.';
    default:
      return 'An unexpected error occurred during sign-in. Please try again.';
  }
};

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase integration is implemented, but Firebase Console configuration and credentials still need to be supplied.');
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    };
  } catch (error) {
    console.error("Firebase Login Error:", error);
    const friendlyError = new Error(getFriendlyAuthError(error.code));
    friendlyError.code = error.code;
    throw friendlyError;
  }
};

export const logout = async () => {
  if (!isFirebaseConfigured) return true;
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Firebase Logout Error:", error);
    throw error;
  }
};
