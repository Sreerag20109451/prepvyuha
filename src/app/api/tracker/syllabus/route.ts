import { NextResponse } from "next/server";
import { z } from "zod";
import { buildTrackerMetrics } from "@/lib/tracker/metrics";
import type { Note } from "@/types/prep";

const schema = z.object({
  subtopics: z.array(
    z.object({
      id: z.string(),
      topicId: z.string(),
      paper: z.enum(["GS1", "GS2", "GS3", "GS4", "Optional"]),
      name: z.string(),
    }),
  ),
  notes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      body: z.string(),
      updatedAt: z.number(),
      syllabusLinks: z
        .array(
          z.object({
            subjectId: z.string(),
            topicId: z.string(),
            subtopicId: z.string(),
          }),
        )
        .optional(),
    }),
  ),
  quizAttemptedTopicIds: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json(
    buildTrackerMetrics({
      papers: ["GS1", "GS2", "GS3", "GS4"],
      subtopics: parsed.data.subtopics.map((s) => ({
        ...s,
        status: "Unread" as const,
        confidenceScore: 3,
        revisionInterval: 0,
        lastRevisedAt: null,
        revisionDueAt: null,
      })),
      notes: parsed.data.notes as Note[],
      quizAttemptedTopicIds: parsed.data.quizAttemptedTopicIds,
    }),
  );
}
