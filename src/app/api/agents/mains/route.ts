import { NextResponse } from "next/server";
import { z } from "zod";
import { runOpenAIJson } from "@/lib/ai/providers";

const schema = z.object({
  topicLabel: z.string().min(1),
  question: z.string().min(1),
  answerText: z.string().min(1),
  notes: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
});

type MainsPayload = {
  score: number;
  strengths: string[];
  gaps: string[];
  improvedStructure: string[];
  pyqRelevance: string;
};

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const fallback: MainsPayload = {
    score: 0,
    strengths: [],
    gaps: ["OpenAI evaluation unavailable. Check server API key."],
    improvedStructure: [],
    pyqRelevance: "",
  };

  const payload = await runOpenAIJson<MainsPayload>({
    fallback,
    system:
      "You are a strict UPSC mains evaluator. Return only JSON. Evaluate relevance, structure, dimensions, examples, constitutional/current-affairs linkage, and conclusion.",
    user: JSON.stringify({
      topic: parsed.data.topicLabel,
      question: parsed.data.question,
      answer: parsed.data.answerText,
      selectedNotes: parsed.data.notes.slice(0, 8),
      requiredShape:
        "{ score: number, strengths: string[], gaps: string[], improvedStructure: string[], pyqRelevance: string }",
    }),
  });

  return NextResponse.json(payload);
}
