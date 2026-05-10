import type { Note } from "@/types/prep";
import type { Paper, SubtopicNode } from "@/lib/domain/types";

export type TrackerMetrics = {
  paper: Paper;
  totalSubtopics: number;
  byNotes: number;
  byQuizzes: number;
  blendedPct: number;
};

export function buildTrackerMetrics(params: {
  papers: Paper[];
  subtopics: Array<SubtopicNode & { paper: Paper }>;
  notes: Note[];
  quizAttemptedTopicIds: string[];
  weightNotes?: number;
  weightQuiz?: number;
}): TrackerMetrics[] {
  const noteSubtopicIds = new Set(
    params.notes.flatMap((n) => (n.syllabusLinks ?? []).map((l) => l.subtopicId)),
  );
  const attemptedTopicIds = new Set(params.quizAttemptedTopicIds);
  const weightNotes = params.weightNotes ?? 0.6;
  const weightQuiz = params.weightQuiz ?? 0.4;

  return params.papers.map((paper) => {
    const pool = params.subtopics.filter((s) => s.paper === paper);
    const totalSubtopics = pool.length;
    const byNotes = pool.filter((s) => noteSubtopicIds.has(s.id)).length;
    const byQuizzes = pool.filter((s) => attemptedTopicIds.has(s.topicId)).length;
    const notePct = totalSubtopics ? byNotes / totalSubtopics : 0;
    const quizPct = totalSubtopics ? byQuizzes / totalSubtopics : 0;
    const blendedPct = Math.round((notePct * weightNotes + quizPct * weightQuiz) * 100);
    return { paper, totalSubtopics, byNotes, byQuizzes, blendedPct };
  });
}
