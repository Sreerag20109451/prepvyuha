import { NextResponse } from "next/server";
import { z } from "zod";
import { runOpenAIJson, searchTavily } from "@/lib/ai/providers";

const schema = z.object({
  topicLabel: z.string().min(1),
  topicId: z.string().min(1),
  notes: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
});

type PyqPayload = {
  pyqs: Array<{
    year: number;
    paper: string;
    type: "Prelims" | "Mains";
    question: string;
    source?: string;
  }>;
};

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const query = `UPSC previous year questions ${parsed.data.topicLabel} prelims mains`;
  const web = await searchTavily(query);
  const fallback: PyqPayload = { pyqs: [] };
  const payload = await runOpenAIJson<PyqPayload>({
    fallback,
    system:
      "You are a UPSC PYQ research agent. Return only JSON. Extract real previous year UPSC CSE questions when evidence is present. Do not invent years or questions.",
    user: JSON.stringify({
      topic: parsed.data.topicLabel,
      notes: parsed.data.notes.map((n) => n.title).slice(0, 8),
      web,
      requiredShape:
        "{ pyqs: [{ year, paper, type: 'Prelims'|'Mains', question, source }] }",
    }),
  });

  return NextResponse.json(payload);
}
