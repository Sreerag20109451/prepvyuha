"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useNotes } from "@/hooks/use-notes";
import { useRevision } from "@/hooks/use-revision";
import { useSyllabusMetrics } from "@/hooks/use-syllabus";

export default function DashboardPage() {
  const { notes, ready: notesReady } = useNotes();
  const { metrics, ready: syllabusReady } = useSyllabusMetrics(notes);
  const { dueToday, topics, ready: revisionReady } = useRevision();

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          <GradientText as="span" className="font-bold">
            Overview
          </GradientText>
        </h1>
        <p className="mt-2 text-[#A0AEC0]">
          Snapshots from your session — jump into any module below.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard glow="purple" className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
            First read (syllabus)
          </p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-white">
            {syllabusReady && notesReady ? `${metrics.firstReadPct}%` : "…"}
          </p>
          <p className="mt-1 text-sm text-[#A0AEC0]">
            {syllabusReady && notesReady
              ? `${metrics.firstReadCount}/${metrics.totalSubtopics} subtopics`
              : "Loading"}
          </p>
          <Link
            href="/syllabus"
            className="mt-4 inline-block text-sm font-medium text-[#D6BCFA] hover:text-white"
          >
            Open tracker →
          </Link>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
            First revision
          </p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-emerald-200">
            {syllabusReady && notesReady ? `${metrics.firstRevisionPct}%` : "…"}
          </p>
          <p className="mt-1 text-sm text-[#A0AEC0]">
            {syllabusReady && notesReady
              ? `${metrics.firstRevisionCount}/${metrics.totalSubtopics} subtopics (≥2 notes)`
              : "Loading"}
          </p>
          <Link
            href="/notes"
            className="mt-4 inline-block text-sm font-medium text-[#D6BCFA] hover:text-white"
          >
            Link more notes →
          </Link>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
            Revision due
          </p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-white">
            {revisionReady ? dueToday.length : "…"}
          </p>
          <p className="mt-1 text-sm text-[#A0AEC0]">
            {revisionReady ? `${topics.length} topics tracked` : "Loading"}
          </p>
          <Link
            href="/revision"
            className="mt-4 inline-block text-sm font-medium text-[#D6BCFA] hover:text-white"
          >
            Review stack →
          </Link>
        </GlassCard>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <GlassCard className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
            Notes
          </p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-white">
            {notesReady ? notes.length : "…"}
          </p>
          <p className="mt-1 text-sm text-[#A0AEC0]">Saved sheets</p>
          <Link
            href="/notes"
            className="mt-4 inline-block text-sm font-medium text-[#D6BCFA] hover:text-white"
          >
            Capture ideas →
          </Link>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-white">Quick paths</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                className="text-[#D6BCFA] hover:text-white"
                href="/practice"
              >
                Practice (quiz + mains)
              </Link>
              <span className="block text-xs text-[#A0AEC0]">
                MCQs, PYQs, and mains structure check
              </span>
            </li>
            <li>
              <Link
                className="text-[#D6BCFA] hover:text-white"
                href="/pomodoro"
              >
                Pomodoro focus
              </Link>
              <span className="block text-xs text-[#A0AEC0]">
                25 / 5 rhythm with glow when running
              </span>
            </li>
            <li>
              <Link className="text-[#D6BCFA] hover:text-white" href="/timeline">
                Timeline
              </Link>
              <span className="block text-xs text-[#A0AEC0]">
                Dates parsed from notes
              </span>
            </li>
            <li>
              <Link className="text-[#D6BCFA] hover:text-white" href="/heatmap">
                Heatmap
              </Link>
              <span className="block text-xs text-[#A0AEC0]">
                Activity by day
              </span>
            </li>
            <li>
              <Link className="text-[#D6BCFA] hover:text-white" href="/calendar">
                Calendar
              </Link>
              <span className="block text-xs text-[#A0AEC0]">
                Revision + milestones
              </span>
            </li>
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-white">Latest notes</h2>
        {!notesReady ? (
          <p className="mt-4 text-sm text-[#A0AEC0]">Loading…</p>
        ) : notes.length === 0 ? (
          <p className="mt-4 text-sm text-[#A0AEC0]">
            No notes yet — start in{" "}
            <Link className="text-[#D6BCFA]" href="/notes">
              Notes
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {notes.slice(0, 4).map((n) => (
              <li
                key={n.id}
                className="truncate rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/90"
              >
                {n.title || "Untitled"}
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
