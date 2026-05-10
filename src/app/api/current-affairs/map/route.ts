import { NextResponse } from "next/server";
import { z } from "zod";
import { mapAffairToSyllabus } from "@/lib/current-affairs/tagger";
import type { SyllabusSubject } from "@/types/prep";

const schema = z.object({
  rawText: z.string().min(20),
  subjects: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      topics: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          subtopics: z.array(
            z.object({
              id: z.string(),
              label: z.string(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json(
    mapAffairToSyllabus(parsed.data.rawText, parsed.data.subjects as SyllabusSubject[]),
  );
}
