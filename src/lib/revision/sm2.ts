import { revisionInputSchema, type RevisionInput } from "@/lib/domain/types";

export type RevisionResult = {
  nextIntervalDays: number;
  nextDueAt: number;
  easeFactor: number;
};

export function computeNextRevision(input: RevisionInput): RevisionResult {
  const parsed = revisionInputSchema.parse(input);
  const quality = parsed.confidenceScore;

  let easeFactor =
    parsed.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, Number(easeFactor.toFixed(2)));

  let nextIntervalDays = parsed.intervalDays;
  if (quality < 3) {
    nextIntervalDays = 1;
  } else if (parsed.intervalDays <= 0) {
    nextIntervalDays = 1;
  } else if (parsed.intervalDays === 1) {
    nextIntervalDays = 3;
  } else {
    nextIntervalDays = Math.round(parsed.intervalDays * easeFactor);
  }

  const nextDueAt =
    parsed.reviewedAt + nextIntervalDays * 24 * 60 * 60 * 1000;
  return { nextIntervalDays, nextDueAt, easeFactor };
}
