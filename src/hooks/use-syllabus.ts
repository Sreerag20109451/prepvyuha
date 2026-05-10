"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, setDoc, writeBatch } from "firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import {
  getFirestoreDb,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import {
  syllabusProgressSchema,
  workspaceCollections,
} from "@/lib/firebase/models";
import {
  buildSyllabusModelFromSubjects,
  subjectsFromSyllabusModel,
} from "@/lib/syllabus-model";
import {
  buildSubtopicRows,
  computeSyllabusProgress,
} from "@/lib/syllabus-progress";
import { DEFAULT_SYLLABUS_SUBJECTS } from "@/lib/syllabus-defaults";
import type { Note, SyllabusModel, SyllabusSubject } from "@/types/prep";

/** Loads the syllabus tree. Progress is derived from notes; see `useSyllabusMetrics`. */
export function useSyllabusTree() {
  const { uid, loading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState<SyllabusSubject[]>(
    DEFAULT_SYLLABUS_SUBJECTS,
  );
  const [syllabus, setSyllabus] = useState<SyllabusModel>(() =>
    buildSyllabusModelFromSubjects(DEFAULT_SYLLABUS_SUBJECTS),
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !uid || uid === "ssr") return;

    const db = getFirestoreDb();
    if (isFirebaseConfigured && db) {
      const ref = doc(db, ...workspaceCollections.syllabus(uid));
      const unsub = onSnapshot(
        ref,
        (snap) => {
          const parsed = syllabusProgressSchema.safeParse(snap.data());
          if (parsed.success) {
            const nextSyllabus =
              parsed.data.syllabus ??
              buildSyllabusModelFromSubjects(
                parsed.data.subjects.length
                  ? parsed.data.subjects
                  : DEFAULT_SYLLABUS_SUBJECTS,
              );
            setSyllabus(nextSyllabus);
            setSubjects(
              parsed.data.subjects.length
                ? parsed.data.subjects
                : subjectsFromSyllabusModel(nextSyllabus),
            );
          } else {
            const fallback =
              buildSyllabusModelFromSubjects(DEFAULT_SYLLABUS_SUBJECTS);
            setSyllabus(fallback);
            setSubjects(DEFAULT_SYLLABUS_SUBJECTS);
          }
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
    async (next: SyllabusSubject[]) => {
      if (!uid) return;
      const db = getFirestoreDb();
      const now = Date.now();
      const nextSyllabus = buildSyllabusModelFromSubjects(next, now);
      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, ...workspaceCollections.syllabus(uid)), {
            version: 3,
            subjects: next,
            syllabus: nextSyllabus,
            updatedAt: now,
          });
          const batch = writeBatch(db);
          for (const paper of nextSyllabus.papers) {
            batch.set(
              doc(db, ...workspaceCollections.syllabusPapers(uid), paper.id),
              paper,
            );
          }
          await batch.commit();
          setSubjects(next);
          setSyllabus(nextSyllabus);
          setError(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not save syllabus");
          throw e;
        }
        return;
      }
      setSubjects(next);
      setSyllabus(nextSyllabus);
    },
    [uid],
  );

  const persistSyllabus = useCallback(
    async (nextSyllabus: SyllabusModel) => {
      if (!uid) return;
      const db = getFirestoreDb();
      const now = Date.now();
      const nextModel = { ...nextSyllabus, version: 4, updatedAt: now };
      const nextSubjects = subjectsFromSyllabusModel(nextModel);

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, ...workspaceCollections.syllabus(uid)), {
            version: 4,
            subjects: nextSubjects,
            syllabus: nextModel,
            updatedAt: now,
          });
          const batch = writeBatch(db);
          for (const paper of nextModel.papers) {
            batch.set(
              doc(db, ...workspaceCollections.syllabusPapers(uid), paper.id),
              paper,
            );
          }
          await batch.commit();
          setSubjects(nextSubjects);
          setSyllabus(nextModel);
          setError(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not save syllabus");
          throw e;
        }
        return;
      }

      setSubjects(nextSubjects);
      setSyllabus(nextModel);
    },
    [uid],
  );

  return { subjects, syllabus, persist, persistSyllabus, ready, error };
}

/** Aggregated first-read and first-revision metrics from note links. */
export function useSyllabusMetrics(notes: Note[]) {
  const { subjects, ready } = useSyllabusTree();
  const metrics = useMemo(
    () => computeSyllabusProgress(subjects, notes),
    [subjects, notes],
  );
  const rows = useMemo(
    () => buildSubtopicRows(subjects, notes),
    [subjects, notes],
  );
  return { subjects, ready, metrics, rows };
}
