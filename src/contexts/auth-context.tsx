"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  getFirebaseAnalytics,
  getFirebaseAuth,
  getFirestoreDb,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import { workspaceCollections } from "@/lib/firebase/models";

type AuthState = {
  user: User | null;
  uid: string | null;
  loading: boolean;
  ready: boolean;
  configured: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function syncUserProfile(user: User) {
  const db = getFirestoreDb();
  if (!db) return;

  const ref = doc(db, ...workspaceCollections.user(user.uid));
  const existing = await getDoc(ref);

  if (!existing.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      provider: "google",
      examTarget: "UPSC 2027",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    return;
  }

  await setDoc(
    ref,
    {
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      provider: "google",
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    void getFirebaseAnalytics();

    const auth = getFirebaseAuth();
    if (!auth) {
      return;
    }

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not sync profile");
        }
      }
    });

    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Firebase is not configured.");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
    }
  }, []);

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      uid: user?.uid ?? null,
      loading,
      ready: !loading,
      configured: isFirebaseConfigured,
      error,
      signInWithGoogle,
      signOutUser,
    }),
    [user, loading, error, signInWithGoogle, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
