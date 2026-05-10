"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
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
import { noteDocSchema, workspaceCollections } from "@/lib/firebase/models";
import { dedupeSyllabusLinks, getNoteSyllabusLinks } from "@/lib/note-links";
import type { Note, NoteKind, NoteStudyStage, SyllabusLink } from "@/types/prep";

function parseSyllabusLinksFromDoc(
  x: Record<string, unknown>,
): SyllabusLink[] | undefined {
  const raw = x.syllabusLinks;
  if (Array.isArray(raw) && raw.length) {
    const links = raw
      .map((item) => {
        const o = item as Record<string, unknown>;
        return {
          subjectId: String(o.subjectId ?? ""),
          topicId: String(o.topicId ?? ""),
          subtopicId: String(o.subtopicId ?? ""),
        };
      })
      .filter((l) => l.subjectId && l.topicId && l.subtopicId);
    return dedupeSyllabusLinks(links);
  }
  return undefined;
}

function parseNoteKind(x: Record<string, unknown>): NoteKind | undefined {
  const raw = x.noteKind;
  if (
    raw === "daily_news" ||
    raw === "current_affairs" ||
    raw === "ncert" ||
    raw === "gs_paper"
  ) {
    return raw;
  }
  return undefined;
}

function parseStudyStage(x: Record<string, unknown>): NoteStudyStage | undefined {
  return x.studyStage === "revision" ? "revision" : "first_read";
}

function mapDoc(id: string, x: Record<string, unknown>): Note {
  const parsed = noteDocSchema.safeParse(x);
  const source: Record<string, unknown> = parsed.success
    ? (parsed.data as unknown as Record<string, unknown>)
    : x;
  const base: Note = {
    id,
    title: String(source.title ?? ""),
    body: String(source.body ?? ""),
    updatedAt: Number(source.updatedAt ?? 0),
    noteKind: parseNoteKind(source),
    ncertStandard:
      typeof source.ncertStandard === "string" ? source.ncertStandard : undefined,
    ncertSubjectId:
      typeof source.ncertSubjectId === "string" ? source.ncertSubjectId : undefined,
    dailyNewsDate:
      typeof source.dailyNewsDate === "string" ? source.dailyNewsDate : undefined,
    currentAffairsStartDate:
      typeof source.currentAffairsStartDate === "string"
        ? source.currentAffairsStartDate
        : undefined,
    currentAffairsEndDate:
      typeof source.currentAffairsEndDate === "string"
        ? source.currentAffairsEndDate
        : undefined,
    currentEventsTopicId:
      typeof source.currentEventsTopicId === "string"
        ? source.currentEventsTopicId
        : undefined,
    studyStage: parseStudyStage(source),
    revisionNumber:
      typeof source.revisionNumber === "number" ? source.revisionNumber : undefined,
    completedSyllabusTopicIds: Array.isArray(source.completedSyllabusTopicIds)
      ? source.completedSyllabusTopicIds.map(String)
      : [],
    completedNcertBookIds: Array.isArray(source.completedNcertBookIds)
      ? source.completedNcertBookIds.map(String)
      : [],
  };

  const fromArray = parseSyllabusLinksFromDoc(source);
  if (fromArray?.length) {
    return { ...base, syllabusLinks: fromArray };
  }

  const sid = (source.subjectId as string | null | undefined) ?? null;
  const tid = (source.topicId as string | null | undefined) ?? null;
  const stid = (source.subtopicId as string | null | undefined) ?? null;
  if (sid && tid && stid) {
    return {
      ...base,
      syllabusLinks: [{ subjectId: sid, topicId: tid, subtopicId: stid }],
      subjectId: sid,
      topicId: tid,
      subtopicId: stid,
    };
  }

  return {
    ...base,
    subjectId: sid,
    topicId: tid,
    subtopicId: stid,
  };
}

export function useNotes() {
  const { uid, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !uid || uid === "ssr") return;

    const db = getFirestoreDb();
    if (isFirebaseConfigured && db) {
      const q = query(
        collection(db, ...workspaceCollections.notes(uid)),
        orderBy("updatedAt", "desc"),
      );
      const unsub = onSnapshot(
        q,
        (snap) => {
          const next: Note[] = snap.docs.map((d) =>
            mapDoc(d.id, d.data() as Record<string, unknown>),
          );
          setNotes(next);
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

  const upsert = useCallback(
    async (note: Omit<Note, "id"> & { id?: string }) => {
      if (!uid) return null;
      const id = note.id ?? crypto.randomUUID();
      const updatedAt = note.updatedAt || Date.now();
      const links = Array.isArray(note.syllabusLinks)
        ? dedupeSyllabusLinks(note.syllabusLinks)
        : getNoteSyllabusLinks(note as Note);

      const next: Note = {
        id,
        title: note.title,
        body: note.body,
        updatedAt,
        syllabusLinks: links,
        noteKind: note.noteKind,
        ncertStandard: note.ncertStandard,
        ncertSubjectId: note.ncertSubjectId,
        dailyNewsDate: note.dailyNewsDate,
        currentAffairsStartDate: note.currentAffairsStartDate,
        currentAffairsEndDate: note.currentAffairsEndDate,
        currentEventsTopicId: note.currentEventsTopicId,
        studyStage: note.studyStage ?? "first_read",
        revisionNumber: note.revisionNumber,
        completedSyllabusTopicIds: note.completedSyllabusTopicIds ?? [],
        completedNcertBookIds: note.completedNcertBookIds ?? [],
      };

      const db = getFirestoreDb();
      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, ...workspaceCollections.note(uid, id)), {
            title: next.title,
            body: next.body,
            updatedAt: next.updatedAt,
            syllabusLinks: next.syllabusLinks ?? [],
            noteKind: next.noteKind ?? null,
            ncertStandard: next.ncertStandard ?? null,
            ncertSubjectId: next.ncertSubjectId ?? null,
            dailyNewsDate: next.dailyNewsDate ?? null,
            currentAffairsStartDate: next.currentAffairsStartDate ?? null,
            currentAffairsEndDate: next.currentAffairsEndDate ?? null,
            currentEventsTopicId: next.currentEventsTopicId ?? null,
            studyStage: next.studyStage ?? "first_read",
            revisionNumber: next.revisionNumber ?? null,
            completedSyllabusTopicIds: next.completedSyllabusTopicIds ?? [],
            completedNcertBookIds: next.completedNcertBookIds ?? [],
            subjectId: null,
            topicId: null,
            subtopicId: null,
          });
          setError(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not save note");
          throw e;
        }
        return next;
      }

      setNotes((list) => [next, ...list.filter((n) => n.id !== id)]);
      return next;
    },
    [uid],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!uid) return;
      const db = getFirestoreDb();
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, ...workspaceCollections.note(uid, id)));
          setError(null);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not delete note");
          throw e;
        }
        return;
      }
      setNotes((list) => list.filter((n) => n.id !== id));
    },
    [uid],
  );

  return { notes, upsert, remove, ready, error };
}
