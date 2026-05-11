"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import {
  getFirestoreDb,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import {
  revisionProfileSchema,
  workspaceCollections,
} from "@/lib/firebase/models";
import type { RevisionTopic } from "@/types/prep";

const AUTO_ALERTS = [
  { label: "24 hr", days: 1 },
  { label: "7 day", days: 7 },
  { label: "Monthly", days: 30 },
  { label: "Yearly", days: 365 },
];

export function useRevision() {
  const { uid, loading: authLoading } = useAuth();
  const [topics, setTopics] = useState<RevisionTopic[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !uid || uid === "ssr") return;

    const db = getFirestoreDb();
    if (isFirebaseConfigured && db) {
      const ref = doc(db, ...workspaceCollections.revision(uid));
      const unsub = onSnapshot(
        ref,
        (snap) => {
          const parsed = revisionProfileSchema.safeParse(snap.data());
          setTopics(parsed.success ? parsed.data.topics : []);
          setError(null);
          setReady(true);
        },
        (e) => {
          setError(e.message);
          setReady(true);
        },
      );
      return () => unsub();
    }
  }, [uid, authLoading]);

  const persist = useCallback(
    async (next: RevisionTopic[]) => {
      if (!uid) return;
      const db = getFirestoreDb();
      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, ...workspaceCollections.revision(uid)), {
            topics: next,
            updatedAt: Date.now(),
          });
          setError(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not save revision");
          throw e;
        }
        return;
      }
      setTopics(next);
    },
    [uid],
  );

  const addTopic = useCallback(
    (title: string, intervalDays = 7) => {
      const next: RevisionTopic[] = [
        {
          id: crypto.randomUUID(),
          title: title.trim(),
          lastReviewedAt: null,
          intervalDays,
          dueAt: Date.now() + intervalDays * 86400000,
          source: "manual",
        },
        ...topics,
      ];
      void persist(next);
      if (!isFirebaseConfigured || !getFirestoreDb()) setTopics(next);
    },
    [topics, persist],
  );

  const markReviewed = useCallback(
    (id: string) => {
      const now = Date.now();
      const next = topics.map((t) =>
        t.id === id
          ? {
              ...t,
              lastReviewedAt: now,
              dueAt: now + t.intervalDays * 86400000,
            }
          : t,
      );
      void persist(next);
      if (!isFirebaseConfigured || !getFirestoreDb()) setTopics(next);
    },
    [topics, persist],
  );

  const removeTopic = useCallback(
    (id: string) => {
      const next = topics.filter((t) => t.id !== id);
      void persist(next);
      if (!isFirebaseConfigured || !getFirestoreDb()) setTopics(next);
    },
    [topics, persist],
  );

  const createNoteAlerts = useCallback(
    async (note: { id: string; title: string; updatedAt: number }) => {
      const baseTime = note.updatedAt || Date.now();
      const existing = topics.filter((t) => t.noteId !== note.id);
      const alerts: RevisionTopic[] = AUTO_ALERTS.map((alert) => ({
        id: `${note.id}-${alert.label}`,
        title: `${note.title || "Untitled note"} · ${alert.label}`,
        lastReviewedAt: baseTime,
        intervalDays: alert.days,
        dueAt: baseTime + alert.days * 86400000,
        noteId: note.id,
        source: "note",
        cadenceLabel: alert.label,
      }));
      const next = [...alerts, ...existing];
      await persist(next);
      if (!isFirebaseConfigured || !getFirestoreDb()) setTopics(next);
    },
    [persist, topics],
  );

  const dueToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const day = 86400000;
    const now = start.getTime() + day;
    return topics.filter((t) => {
      const due = t.dueAt ?? (
        t.lastReviewedAt == null
          ? now
          : t.lastReviewedAt + t.intervalDays * day
      );
      return due < now;
    });
  }, [topics]);

  return {
    topics,
    dueToday,
    addTopic,
    markReviewed,
    removeTopic,
    createNoteAlerts,
    ready,
    error,
  };
}
