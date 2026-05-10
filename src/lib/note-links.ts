import type { Note, SyllabusLink, SyllabusSubject } from "@/types/prep";

export function dedupeSyllabusLinks(links: SyllabusLink[]): SyllabusLink[] {
  const seen = new Set<string>();
  const out: SyllabusLink[] = [];
  for (const l of links) {
    if (!l.subjectId || !l.topicId || !l.subtopicId) continue;
    const k = `${l.subjectId}:${l.topicId}:${l.subtopicId}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(l);
  }
  return out;
}

/** Canonical links for a note (supports legacy single triple + `syllabusLinks`). */
export function getNoteSyllabusLinks(note: Note): SyllabusLink[] {
  if (note.syllabusLinks?.length) {
    return dedupeSyllabusLinks(note.syllabusLinks);
  }
  if (note.subjectId && note.topicId && note.subtopicId) {
    return dedupeSyllabusLinks([
      {
        subjectId: note.subjectId,
        topicId: note.topicId,
        subtopicId: note.subtopicId,
      },
    ]);
  }
  return [];
}

export function resolveSyllabusLinkFromSubtopicId(
  subjects: SyllabusSubject[],
  subtopicId: string,
): SyllabusLink | null {
  for (const s of subjects) {
    for (const t of s.topics) {
      for (const st of t.subtopics) {
        if (st.id === subtopicId) {
          return {
            subjectId: s.id,
            topicId: t.id,
            subtopicId: st.id,
          };
        }
      }
    }
  }
  return null;
}
