import type { SyllabusSubject } from "@/types/prep";

export type AffairTagResult = {
  topicIds: string[];
  subtopicIds: string[];
  confidence: number;
};

function norm(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function mapAffairToSyllabus(
  text: string,
  subjects: SyllabusSubject[],
): AffairTagResult {
  const tokens = new Set(norm(text));
  const topicMatches: Array<{ id: string; score: number }> = [];
  const subtopicMatches: Array<{ id: string; score: number }> = [];

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const tWords = norm(topic.label);
      const tScore = tWords.reduce((acc, w) => acc + (tokens.has(w) ? 1 : 0), 0);
      if (tScore > 0) topicMatches.push({ id: topic.id, score: tScore });
      for (const sub of topic.subtopics) {
        const sWords = norm(sub.label);
        const sScore = sWords.reduce(
          (acc, w) => acc + (tokens.has(w) ? 1 : 0),
          0,
        );
        if (sScore > 0) subtopicMatches.push({ id: sub.id, score: sScore });
      }
    }
  }

  topicMatches.sort((a, b) => b.score - a.score);
  subtopicMatches.sort((a, b) => b.score - a.score);
  const best = Math.max(topicMatches[0]?.score ?? 0, subtopicMatches[0]?.score ?? 0);
  const confidence = Math.min(100, best * 30);

  return {
    topicIds: topicMatches.slice(0, 3).map((x) => x.id),
    subtopicIds: subtopicMatches.slice(0, 5).map((x) => x.id),
    confidence,
  };
}
