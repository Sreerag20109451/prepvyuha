"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import {
  getFirestoreDb,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import {
  studySessionSchema,
  workspaceCollections,
} from "@/lib/firebase/models";
import type { StudySession } from "@/types/prep";

export function useStudySessions() {
  const { uid, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !uid) return;
    const db = getFirestoreDb();
    if (isFirebaseConfigured && db) {
      const q = query(
        collection(db, ...workspaceCollections.sessions(uid)),
        orderBy("startedAt", "desc"),
      );
      const unsub = onSnapshot(
        q,
        (snap) => {
          setSessions(
            snap.docs.map((d) => {
              const parsed = studySessionSchema.safeParse({
                id: d.id,
                ...d.data(),
              });
              return parsed.success
                ? parsed.data
                : {
                    id: d.id,
                    kind: "note",
                    title: "Study session",
                    startedAt: Date.now(),
                    endedAt: null,
                    durationMinutes: 0,
                  };
            }),
          );
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
  }, [authLoading, uid]);

  const addSession = useCallback(
    async (session: Omit<StudySession, "id"> & { id?: string }) => {
      if (!uid) return;
      const id = session.id ?? crypto.randomUUID();
      const next: StudySession = {
        id,
        kind: session.kind,
        title: session.title,
        startedAt: session.startedAt,
        endedAt: session.endedAt ?? null,
        durationMinutes: session.durationMinutes,
        noteId: session.noteId ?? null,
        topicId: session.topicId ?? null,
        currentEventsTopicId: session.currentEventsTopicId ?? null,
        syllabusLinks: session.syllabusLinks ?? [],
      };
      const db = getFirestoreDb();
      if (isFirebaseConfigured && db) {
        await setDoc(doc(db, ...workspaceCollections.sessions(uid), id), next);
        return;
      }
      setSessions((list) => [next, ...list.filter((x) => x.id !== id)]);
    },
    [uid],
  );

  return { sessions, addSession, ready, error };
}
