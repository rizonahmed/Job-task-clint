import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { auth } from "../Firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    signOutUser,
    googleSignIn,
  };

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("CurrentUser-->", currentUser?.email);
      if (currentUser?.email) {
        setUser(currentUser);
        await axios.post(
          `https://task-mate-server-gold.vercel.app/jwt`,
          {
            email: currentUser?.email,
          },
          { withCredentials: true }
        );
      } else {
        setUser(currentUser);
        await axios.get(`https://task-mate-server-gold.vercel.app/logout`, {
          withCredentials: true,
        });
      }
      setLoading(false);
    });
    return () => {
      return unsubscribe();
    };
  }, [])

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
