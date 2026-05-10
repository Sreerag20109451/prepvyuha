"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useNotes } from "@/hooks/use-notes";
import { extractTimelineItems } from "@/lib/timeline/extract";

export default function TimelinePage() {
  const { notes } = useNotes();
  const items = extractTimelineItems(notes);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white md:text-3xl">
        <GradientText as="span" className="font-bold">
          Interactive timeline
        </GradientText>
      </h1>
      <GlassCard className="max-h-[70vh] space-y-3 overflow-y-auto p-6">
        {items.length === 0 ? (
          <p className="text-sm text-[#A0AEC0]">
            No parseable dates yet. Use dd/mm/yyyy in notes.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={`${item.noteId}-${item.raw}-${item.date}`}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <p className="text-xs text-[#A0AEC0]">{new Date(item.date).toDateString()}</p>
              <p className="mt-1 text-sm text-white">{item.title}</p>
              <p className="mt-1 text-xs text-[#A0AEC0]">Matched: {item.raw}</p>
            </div>
          ))
        )}
      </GlassCard>
    </div>
  );
}
