import type { MCQQuestion, PYQ } from "@/lib/domain/types";
import { MOCK_PYQS } from "@/lib/mock-data/pyq";
import type { Note } from "@/types/prep";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((x) => x.length > 4);
}

function topKeywords(text: string, count = 8): string[] {
  const freq = new Map<string, number>();
  for (const t of tokenize(text)) {
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([k]) => k);
}

export function generateTopicQuiz(topicId: string, notes: Note[]): {
  mcqs: MCQQuestion[];
  pyqs: PYQ[];
} {
  const topicNotes = notes.filter((n) =>
    (n.syllabusLinks ?? []).some(
      (l) => l.topicId === topicId || l.subtopicId === topicId,
    ),
  );
  const corpus = topicNotes.map((n) => `${n.title} ${n.body}`).join(" ");
  const keywords = topKeywords(corpus || topicId.replace(/-/g, " "), 10);
  const stemSeed = keywords.length ? keywords : ["concept", "application"];

  const mcqs: MCQQuestion[] = Array.from({ length: 5 }).map((_, i) => {
    const k = stemSeed[i % stemSeed.length];
    return {
      id: `mcq-${topicId}-${i + 1}`,
      quizId: `quiz-${topicId}-${Date.now()}`,
      stem: `Which statement is most accurate about ${k} in UPSC context?`,
      options: [
        `It is only relevant for prelims factual recall.`,
        `It links concept with governance applications.`,
        `It has no relation with PYQ trend analysis.`,
        `It appears only in optional subjects.`,
      ],
      answerIndex: 1,
      explanation:
        "UPSC rewards conceptual clarity connected to governance, institutions, and interlinkages.",
      sourceNoteId: topicNotes[0]?.id ?? null,
    };
  });

  const pyqs = MOCK_PYQS.filter((p) => p.topicId === topicId).slice(0, 2);
  return { mcqs, pyqs };
}
