import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp | undefined {
  if (!isFirebaseConfigured) return undefined;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  }
  return getApps()[0] ?? app;
}

export function getFirebaseAuth(): Auth | undefined {
  const a = getFirebaseApp();
  return a ? getAuth(a) : undefined;
}

export function getFirestoreDb(): Firestore | undefined {
  const a = getFirebaseApp();
  return a ? getFirestore(a) : undefined;
}

export async function getFirebaseAnalytics(): Promise<Analytics | undefined> {
  const a = getFirebaseApp();
  if (!a) return undefined;
  return (await isSupported()) ? getAnalytics(a) : undefined;
}
