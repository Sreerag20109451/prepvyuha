import { NextResponse } from "next/server";
import { z } from "zod";
import { generateTopicQuiz } from "@/lib/quiz/generator";
import type { Note } from "@/types/prep";

const schema = z.object({
  topicId: z.string().min(1),
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
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const notes = parsed.data.notes as Note[];
  return NextResponse.json(generateTopicQuiz(parsed.data.topicId, notes));
}
