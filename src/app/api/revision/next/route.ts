import { NextResponse } from "next/server";
import { z } from "zod";
import { computeNextRevision } from "@/lib/revision/sm2";

const schema = z.object({
  intervalDays: z.number().nonnegative(),
  easeFactor: z.number().min(1.3).optional(),
  confidenceScore: z.number().int().min(1).max(5),
  reviewedAt: z.number().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json(
    computeNextRevision({
      intervalDays: parsed.data.intervalDays,
      confidenceScore: parsed.data.confidenceScore,
      easeFactor: parsed.data.easeFactor ?? 2.5,
      reviewedAt: parsed.data.reviewedAt ?? Date.now(),
    }),
  );
}
