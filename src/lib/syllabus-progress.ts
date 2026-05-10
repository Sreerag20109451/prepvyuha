import { getNoteSyllabusLinks } from "@/lib/note-links";
import type {
  Note,
  SyllabusProgressMetrics,
  SyllabusSubject,
  SubtopicProgressRow,
} from "@/types/prep";

/** Notes that count toward the GS syllabus tree (excludes pure NCERT notes). */
export function notesForGsSyllabus(notes: Note[]): Note[] {
  return notes.filter((n) => n.noteKind !== "ncert");
}

/** Notes tracked against the NCERT tree. */
export function notesForNcertSyllabus(notes: Note[]): Note[] {
  return notes.filter((n) => n.noteKind === "ncert");
}

export function flattenSubtopicIds(subjects: SyllabusSubject[]): string[] {
  const ids: string[] = [];
  for (const s of subjects) {
    for (const t of s.topics) {
      for (const st of t.subtopics) {
        ids.push(st.id);
      }
    }
  }
  return ids;
}

type ProgressCounts = {
  total: number;
  firstRead: number;
  revision: number;
};

/** Count completed topics only; plain tags do not mark syllabus progress. */
export function countNotesPerSubtopic(
  subjects: SyllabusSubject[],
  notes: Note[],
): Map<string, ProgressCounts> {
  const valid = new Set(flattenSubtopicIds(subjects));
  const counts = new Map<string, ProgressCounts>();
  for (const n of notes) {
    const completed = new Set(n.completedSyllabusTopicIds ?? []);
    for (const id of completed) {
      if (!valid.has(id)) continue;
      const current = counts.get(id) ?? { total: 0, firstRead: 0, revision: 0 };
      current.total += 1;
      if (n.studyStage === "revision") current.revision += 1;
      else current.firstRead += 1;
      counts.set(id, current);
    }

    if (n.noteKind === "ncert") {
      for (const id of n.completedNcertBookIds ?? []) {
        if (!valid.has(id)) continue;
        const current = counts.get(id) ?? { total: 0, firstRead: 0, revision: 0 };
        current.total += 1;
        if (n.studyStage === "revision") current.revision += 1;
        else current.firstRead += 1;
        counts.set(id, current);
      }
    }
  }
  return counts;
}

/** Short label for sidebar — first links + count. */
export function formatNoteLinksSummary(
  subjects: SyllabusSubject[],
  note: Note,
): string | null {
  const links = getNoteSyllabusLinks(note);
  if (!links.length) return null;
  const bits = links
    .map((l) =>
      resolveNoteLabels(subjects, l.subjectId, l.topicId, l.subtopicId),
    )
    .filter(Boolean)
    .map((x) => `${x!.subject} · ${x!.subtopic}`);
  if (!bits.length) return null;
  if (bits.length <= 2) return bits.join(" · ");
  return `${bits[0]} · ${bits[1]} +${bits.length - 2}`;
}

/**
 * First read: ≥1 note linked to subtopic.
 * First revision: ≥2 distinct notes (sessions) linked to same subtopic — second note completes first revision pass.
 */
export function computeSyllabusProgress(
  subjects: SyllabusSubject[],
  notes: Note[],
): SyllabusProgressMetrics {
  const ids = flattenSubtopicIds(subjects);
  const total = ids.length;
  if (total === 0) {
    return {
      totalSubtopics: 0,
      firstReadCount: 0,
      firstRevisionCount: 0,
      firstReadPct: 0,
      firstRevisionPct: 0,
    };
  }

  const counts = countNotesPerSubtopic(subjects, notes);

  let firstRead = 0;
  let firstRevision = 0;
  for (const id of ids) {
    const c = counts.get(id);
    if (c && (c.firstRead > 0 || c.revision > 0)) firstRead++;
    if (c && c.revision > 0) firstRevision++;
  }

  return {
    totalSubtopics: total,
    firstReadCount: firstRead,
    firstRevisionCount: firstRevision,
    firstReadPct: Math.round((firstRead / total) * 100),
    firstRevisionPct: Math.round((firstRevision / total) * 100),
  };
}

export function buildSubtopicRows(
  subjects: SyllabusSubject[],
  notes: Note[],
): SubtopicProgressRow[] {
  const counts = countNotesPerSubtopic(subjects, notes);
  const rows: SubtopicProgressRow[] = [];
  for (const s of subjects) {
    for (const t of s.topics) {
      for (const st of t.subtopics) {
        const count = counts.get(st.id);
        rows.push({
          subtopicId: st.id,
          label: st.label,
          subjectLabel: s.label,
          topicLabel: t.label,
          noteCount: count?.total ?? 0,
          hasFirstRead: Boolean(count && (count.firstRead > 0 || count.revision > 0)),
          hasFirstRevision: Boolean(count && count.revision > 0),
        });
      }
    }
  }
  return rows;
}

export function resolveNoteLabels(
  subjects: SyllabusSubject[],
  subjectId: string | null | undefined,
  topicId: string | null | undefined,
  subtopicId: string | null | undefined,
): { subject: string; topic: string; subtopic: string } | null {
  if (!subjectId || !topicId || !subtopicId) return null;
  const s = subjects.find((x) => x.id === subjectId);
  if (!s) return null;
  const t = s.topics.find((x) => x.id === topicId);
  if (!t) return null;
  const st = t.subtopics.find((x) => x.id === subtopicId);
  if (!st) return null;
  return { subject: s.label, topic: t.label, subtopic: st.label };
}
