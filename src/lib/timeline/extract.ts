import type { Note } from "@/types/prep";

export type TimelineItem = {
  noteId: string;
  title: string;
  date: number;
  raw: string;
};

const DATE_RE = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g;

export function extractTimelineItems(notes: Note[]): TimelineItem[] {
  const out: TimelineItem[] = [];
  for (const note of notes) {
    const text = `${note.title} ${note.body.replace(/<[^>]+>/g, " ")}`;
    for (const m of text.matchAll(DATE_RE)) {
      const day = Number(m[1]);
      const month = Number(m[2]);
      let year = Number(m[3]);
      if (year < 100) year += 2000;
      const date = new Date(year, month - 1, day).getTime();
      if (!Number.isNaN(date)) {
        out.push({
          noteId: note.id,
          title: note.title || "Untitled",
          date,
          raw: m[0],
        });
      }
    }
  }
  return out.sort((a, b) => a.date - b.date);
}
