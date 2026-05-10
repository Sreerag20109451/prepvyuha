"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useNotes } from "@/hooks/use-notes";

function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function HeatmapPage() {
  const { notes } = useNotes();
  const counts = new Map<string, number>();
  for (const n of notes) {
    const k = dayKey(n.updatedAt);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const days = Array.from({ length: 56 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (55 - i));
    const k = dayKey(d.getTime());
    const c = counts.get(k) ?? 0;
    return { k, c };
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white md:text-3xl">
        <GradientText as="span" className="font-bold">
          Syllabus heatmap
        </GradientText>
      </h1>
      <GlassCard className="p-6">
        <div className="grid grid-cols-14 gap-2">
          {days.map((d) => (
            <div
              key={d.k}
              title={`${d.k}: ${d.c} updates`}
              className={`h-5 w-5 rounded ${d.c === 0 ? "bg-white/10" : d.c === 1 ? "bg-purple-500/40" : "bg-emerald-500/45"}`}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
