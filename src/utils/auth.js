import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Create user profile with role
export const createUserProfile = async (user, role = 'user') => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      role: role,
      createdAt: new Date(),
      displayName: user.displayName || '',
    });
  }
};



// Get user role from Firestore
export const getUserRole = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  return 'user'; // default role
};
