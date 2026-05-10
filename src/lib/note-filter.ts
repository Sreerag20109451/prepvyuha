import { getNoteSyllabusLinks } from "@/lib/note-links";
import type { Note } from "@/types/prep";

export type NoteReaderFilter = {
  paperId: string;
  /** Syllabus topic id (mid level). */
  subjectTopicId: string;
  /** Syllabus subtopic id (leaf). */
  subtopicId: string;
};

export function hasActiveReaderFilter(f: NoteReaderFilter): boolean {
  return !!(f.paperId || f.subjectTopicId || f.subtopicId);
}

/** Note matches if any syllabus link satisfies all set filter parts (AND). */
export function noteMatchesReaderFilter(note: Note, f: NoteReaderFilter): boolean {
  if (!hasActiveReaderFilter(f)) return true;
  const links = getNoteSyllabusLinks(note);
  if (links.length === 0) return false;
  return links.some((l) => {
    if (f.paperId && l.subjectId !== f.paperId) return false;
    if (f.subjectTopicId && l.topicId !== f.subjectTopicId) return false;
    if (f.subtopicId && l.subtopicId !== f.subtopicId) return false;
    return true;
  });
}

export function filterNotesForReader(notes: Note[], f: NoteReaderFilter): Note[] {
  return notes.filter((n) => noteMatchesReaderFilter(n, f));
}
