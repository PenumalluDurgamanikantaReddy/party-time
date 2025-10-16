"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app as firebase_app } from '../lib/firebase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const TOKEN_KEY = 'firebase_auth_token';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Use refs to store Firebase services to ensure they are only created once on the client
    const authRef = useRef(null);
    const googleProviderRef = useRef(null);

    useEffect(() => {
        // Initialize Firebase services only on the client-side
        if (typeof window !== 'undefined' && firebase_app) {
            if (!authRef.current) {
                authRef.current = getAuth(firebase_app);
                googleProviderRef.current = new GoogleAuthProvider();
            }

            const unsubscribe = onAuthStateChanged(authRef.current, (user) => {
                setUser(user);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            // If not on client or firebase_app is not ready, stop loading
            setLoading(false);
        }
    }, []);

    const signInWithGoogle = async () => {
        // Ensure auth and provider are initialized before using them
        if (!authRef.current || !googleProviderRef.current) {
            console.error("Firebase auth or provider not initialized");
            return;
        }
        try {
            const result = await signInWithPopup(authRef.current, googleProviderRef.current);
            const token = await result.user.getIdToken();
            if (typeof window !== 'undefined') {
                localStorage.setItem(TOKEN_KEY, token);
            }
            router.push('/'); // Redirect to home on successful login
        } catch (error) {
            console.error("Error during sign in:", error);
        }
    };

    const logout = async () => {
        if (authRef.current) {
            await authRef.current.signOut();
            if (typeof window !== 'undefined') {
                localStorage.removeItem(TOKEN_KEY);
            }
            router.push('/login'); // Redirect to login on logout
        }
    };

    const value = {
        user,
        loading,
        signInWithGoogle,
        logout,
    };

    // Prevent children from rendering until authentication state is determined
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
