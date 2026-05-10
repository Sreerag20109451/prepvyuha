import type { Paper } from "@/lib/domain/types";
import type { SyllabusSubject } from "@/types/prep";

function labelToPaper(label: string): Paper {
  const l = label.toLowerCase();
  if (l.includes("gs i") || l.includes("gs 1")) return "GS1";
  if (l.includes("gs ii") || l.includes("gs 2")) return "GS2";
  if (l.includes("gs iii") || l.includes("gs 3")) return "GS3";
  if (l.includes("gs iv") || l.includes("gs 4")) return "GS4";
  return "Optional";
}

export function flattenSubtopics(subjects: SyllabusSubject[]) {
  return subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) =>
      topic.subtopics.map((sub) => ({
        id: sub.id,
        topicId: topic.id,
        name: sub.label,
        paper: labelToPaper(subject.label),
      })),
    ),
  );
}
