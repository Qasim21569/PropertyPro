import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, name, role) => {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        name: name,
        role: role || "user",
        createdAt: new Date(),
        bookings: [],
        favorites: []
      };

      await setDoc(doc(db, "users", user.uid), userProfile);
      setUserProfile(userProfile);
      
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Sign in function
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out function
  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  // Reset password function
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const profile = userDoc.data();
        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  };

  // Update user profile in Firestore
  const updateUserProfile = async (uid, updates) => {
    try {
      await setDoc(doc(db, "users", uid), updates, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user profile when user is authenticated
        await getUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
