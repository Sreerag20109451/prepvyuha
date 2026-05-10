import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateMainsAnswer } from "@/lib/evaluator/structure";

const schema = z.object({
  answerText: z.string().min(1),
  keywords: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json(
    evaluateMainsAnswer(parsed.data.answerText, parsed.data.keywords),
  );
}
