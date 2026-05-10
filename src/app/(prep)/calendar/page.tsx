"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useNotes } from "@/hooks/use-notes";
import { useRevision } from "@/hooks/use-revision";
import { useStudySessions } from "@/hooks/use-study-sessions";
import { UPSC_2027_MILESTONES } from "@/lib/mock-data/milestones";

function dayKey(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

export default function SmartCalendarPage() {
  const { notes } = useNotes();
  const { dueToday } = useRevision();
  const { sessions } = useStudySessions();

  const byDay = new Map<string, string[]>();
  function add(date: number, title: string) {
    const key = dayKey(date);
    byDay.set(key, [...(byDay.get(key) ?? []), title]);
  }

  for (const note of notes) {
    const current =
      note.currentEventsTopicId && note.noteKind !== "gs_paper"
        ? ` · CA: ${note.currentEventsTopicId}`
        : "";
    add(note.updatedAt, `Note: ${note.title}${current}`);
  }
  for (const session of sessions) {
    add(
      session.startedAt,
      `${session.kind}: ${session.title} (${session.durationMinutes} min)`,
    );
  }
  const todayNoon = new Date();
  todayNoon.setHours(12, 0, 0, 0);
  for (const topic of dueToday) {
    add(todayNoon.getTime(), `Revision due: ${topic.title}`);
  }
  for (const milestone of UPSC_2027_MILESTONES) {
    add(milestone.date, milestone.title);
  }

  const days = [...byDay.entries()].sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          <GradientText as="span" className="font-bold">
            Study calendar
          </GradientText>
        </h1>
        <p className="mt-2 text-sm text-[#A0AEC0]">
          Notes, current affairs, Pomodoro sessions, and revision cues by day.
        </p>
      </div>

      <GlassCard className="space-y-4 p-6">
        {days.length === 0 ? (
          <p className="text-sm text-[#A0AEC0]">No study activity yet.</p>
        ) : (
          days.map(([date, items]) => (
            <div
              key={date}
              className="rounded-xl border border-white/10 bg-black/25 p-4"
            >
              <p className="font-semibold text-white">
                {new Date(`${date}T12:00:00`).toDateString()}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#A0AEC0]">
                {items.map((item, index) => (
                  <li key={`${date}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </GlassCard>
    </div>
  );
}
