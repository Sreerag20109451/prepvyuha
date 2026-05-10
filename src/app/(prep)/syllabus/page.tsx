"use client";

import { useMemo, useState } from "react";
import { DownloadCloud } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useNotes } from "@/hooks/use-notes";
import { useSyllabusTree } from "@/hooks/use-syllabus";
import {
  DEFAULT_NCERT_SUBJECTS,
  topicIdForStandard,
} from "@/lib/ncert-defaults";
import {
  CURRENT_EVENTS_SECTION,
  FULL_UPSC_SYLLABUS_MODEL,
} from "@/lib/syllabus-defaults";
import {
  buildSubtopicRows,
  computeSyllabusProgress,
  notesForGsSyllabus,
  notesForNcertSyllabus,
} from "@/lib/syllabus-progress";
import type { SyllabusPaperNode, SyllabusSubject } from "@/types/prep";

type RowLookup = Map<
  string,
  { noteCount: number; hasFirstRead?: boolean; hasFirstRevision?: boolean }
>;
type Tab = "gs" | "ncert" | "overall";

function HeatSquare({
  count,
  revision,
}: {
  count: number;
  revision?: boolean;
}) {
  const cls =
    count === 0
      ? "bg-white/10 border-white/15"
      : revision
        ? "bg-emerald-500/35 border-emerald-400/45"
        : "bg-purple-500/40 border-purple-400/50";
  return <span className={`inline-block h-7 w-7 rounded-lg border ${cls}`} />;
}

function LegacySubjectBlock({
  subject,
  rowLookup,
}: {
  subject: SyllabusSubject;
  rowLookup: RowLookup;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-white">{subject.label}</span>
        <span className="text-xs text-[#A0AEC0]">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="space-y-4 px-5 pb-5">
          {subject.topics.map((topic) => (
            <div key={topic.id}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
                {topic.label}
              </p>
              <ul className="space-y-2">
                {topic.subtopics.map((st) => {
                  const row = rowLookup.get(st.id);
                  const count = row?.noteCount ?? 0;
                  return (
                    <li
                      key={st.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3"
                    >
                      <span className="text-sm text-white/95">{st.label}</span>
                      <div className="flex items-center gap-3">
                        <HeatSquare
                          count={count}
                          revision={row?.hasFirstRevision}
                        />
                        <span className="text-xs text-[#A0AEC0]">
                          {row?.hasFirstRevision
                            ? "Revision done"
                            : row?.hasFirstRead
                              ? "First read done"
                              : "Not finished"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaperTree({ paper, rowLookup }: { paper: SyllabusPaperNode; rowLookup: RowLookup }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-white">{paper.label}</span>
        <span className="text-xs text-[#A0AEC0]">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="space-y-3 px-5 pb-5">
          {paper.subjects.map((subject) => (
            <SubjectTree key={subject.id} subject={subject} rowLookup={rowLookup} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubjectTree({
  subject,
  rowLookup,
}: {
  subject: SyllabusPaperNode["subjects"][number];
  rowLookup: RowLookup;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-black/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-white"
      >
        {subject.label}
        <span className="text-xs font-normal text-[#A0AEC0]">
          {open ? "Hide" : "Expand"}
        </span>
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4">
          {subject.specificSubjects.map((specific) => (
            <details key={specific.id} className="rounded-lg bg-white/[0.03] p-3">
              <summary className="cursor-pointer text-sm text-[#D6BCFA]">
                {specific.label}
              </summary>
              <div className="mt-3 space-y-3">
                {specific.areas.map((area) => (
                  <div key={area.id}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#A0AEC0]">
                      {area.label}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {area.topics.map((topic) => {
                        const row = rowLookup.get(topic.id);
                        const count = row?.noteCount ?? 0;
                        return (
                          <li
                            key={topic.id}
                            className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/90"
                          >
                            <span>{topic.label}</span>
                            <div className="flex items-center gap-2">
                              <HeatSquare
                                count={count}
                                revision={row?.hasFirstRevision}
                              />
                              <span className="text-xs text-[#A0AEC0]">
                                {row?.hasFirstRevision
                                  ? "Revision done"
                                  : row?.hasFirstRead
                                    ? "First read done"
                                    : "Not finished"}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricsStrip({
  label,
  metrics,
  ready,
}: {
  label: string;
  metrics: ReturnType<typeof computeSyllabusProgress>;
  ready: boolean;
}) {
  return (
    <GlassCard glow="purple" className="p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
        {label} first read
      </p>
      <p className="mt-2 text-4xl font-bold tabular-nums text-white">
        {ready ? `${metrics.firstReadPct}%` : "..."}
      </p>
      <p className="mt-1 text-sm text-[#A0AEC0]">
        {ready
          ? `${metrics.firstReadCount} / ${metrics.totalSubtopics} topics`
          : "Loading"}
      </p>
    </GlassCard>
  );
}

export default function SyllabusPage() {
  const { notes, ready: notesReady } = useNotes();
  const { subjects, syllabus, persistSyllabus, ready: syllabusReady } =
    useSyllabusTree();
  const [tab, setTab] = useState<Tab>("gs");
  const [seedState, setSeedState] = useState<"idle" | "saving" | "done">("idle");
  const [seedError, setSeedError] = useState<string | null>(null);

  const gsNotes = useMemo(() => notesForGsSyllabus(notes), [notes]);
  const ncertNotes = useMemo(() => notesForNcertSyllabus(notes), [notes]);
  const ncertProgressNotes = useMemo(
    () =>
      ncertNotes.map((note) => ({
        ...note,
        syllabusLinks:
          note.ncertStandard && note.ncertSubjectId
            ? [
                {
                  subjectId: "ncert",
                  topicId: topicIdForStandard(note.ncertStandard),
                  subtopicId: note.ncertSubjectId,
                },
              ]
            : [],
      })),
    [ncertNotes],
  );

  const gsMetrics = useMemo(
    () => computeSyllabusProgress(subjects, gsNotes),
    [subjects, gsNotes],
  );
  const gsRows = useMemo(
    () => buildSubtopicRows(subjects, gsNotes),
    [subjects, gsNotes],
  );
  const ncertMetrics = useMemo(
    () => computeSyllabusProgress(DEFAULT_NCERT_SUBJECTS, ncertProgressNotes),
    [ncertProgressNotes],
  );
  const ncertRows = useMemo(
    () => buildSubtopicRows(DEFAULT_NCERT_SUBJECTS, ncertProgressNotes),
    [ncertProgressNotes],
  );
  const gsLookup = useMemo(
    () =>
      new Map(
        gsRows.map((row) => [
          row.subtopicId,
          {
            noteCount: row.noteCount,
            hasFirstRead: row.hasFirstRead,
            hasFirstRevision: row.hasFirstRevision,
          },
        ]),
      ),
    [gsRows],
  );
  const ncertLookup = useMemo(
    () =>
      new Map(
        ncertRows.map((row) => [
          row.subtopicId,
          {
            noteCount: row.noteCount,
            hasFirstRead: row.hasFirstRead,
            hasFirstRevision: row.hasFirstRevision,
          },
        ]),
      ),
    [ncertRows],
  );

  const ready = notesReady && syllabusReady;

  async function addFullSyllabus() {
    setSeedState("saving");
    setSeedError(null);
    try {
      await persistSyllabus(FULL_UPSC_SYLLABUS_MODEL);
      setSeedState("done");
    } catch (e) {
      setSeedError(e instanceof Error ? e.message : "Could not add syllabus");
      setSeedState("idle");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          <GradientText as="span" className="font-bold">
            Syllabus & trackers
          </GradientText>
        </h1>
        <p className="mt-2 text-sm text-[#A0AEC0]">
          Paper, subject, specific subject, decoded area, and topic.
        </p>
      </div>

      <GlassCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Full syllabus library</p>
          <p className="mt-1 text-xs leading-relaxed text-[#A0AEC0]">
            Saves the corrected hierarchy to Firestore for your account.
          </p>
          {seedError ? (
            <p className="mt-2 text-xs text-rose-200">{seedError}</p>
          ) : seedState === "done" ? (
            <p className="mt-2 text-xs text-emerald-200">Full syllabus added.</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void addFullSyllabus()}
          disabled={seedState === "saving"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-purple-400/35 bg-purple-500/20 px-4 py-2.5 text-sm font-medium text-[#E9D8FD] transition-colors hover:bg-purple-500/30 disabled:opacity-60"
        >
          <DownloadCloud className="h-4 w-4" aria-hidden />
          {seedState === "saving" ? "Adding..." : "Add full syllabus"}
        </button>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-sm font-semibold text-white">
          {CURRENT_EVENTS_SECTION.label}
        </p>
        <p className="mt-1 text-xs text-[#A0AEC0]">
          Separate syllabus stream. It can guide notes but is not tracked as
          progress.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CURRENT_EVENTS_SECTION.areas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-[#A0AEC0]"
            >
              {area}
            </span>
          ))}
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["gs", "UPSC"],
            ["ncert", "NCERT"],
            ["overall", "Overall"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium ${
              tab === id
                ? "border-purple-400/50 bg-purple-500/20 text-[#E9D8FD]"
                : "border-white/15 text-[#A0AEC0] hover:bg-white/5 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overall" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wider text-[#A0AEC0]">
              UPSC first read
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {ready ? `${gsMetrics.firstReadPct}%` : "..."}
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wider text-[#A0AEC0]">
              NCERT first read
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {ready ? `${ncertMetrics.firstReadPct}%` : "..."}
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-wider text-[#A0AEC0]">
              Total notes
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {notesReady ? notes.length : "..."}
            </p>
          </GlassCard>
        </div>
      )}

      {tab === "gs" && (
        <>
          <MetricsStrip label="UPSC syllabus" metrics={gsMetrics} ready={ready} />
          <GlassCard className="overflow-hidden">
            {!ready ? (
              <p className="p-6 text-sm text-[#A0AEC0]">Loading...</p>
            ) : (
              syllabus.papers.map((paper) => (
                <PaperTree key={paper.id} paper={paper} rowLookup={gsLookup} />
              ))
            )}
          </GlassCard>
        </>
      )}

      {tab === "ncert" && (
        <>
          <MetricsStrip
            label="NCERT tracker"
            metrics={ncertMetrics}
            ready={ready}
          />
          <GlassCard className="overflow-hidden">
            {!ready ? (
              <p className="p-6 text-sm text-[#A0AEC0]">Loading...</p>
            ) : (
              DEFAULT_NCERT_SUBJECTS.map((s) => (
                <LegacySubjectBlock
                  key={s.id}
                  subject={s}
                  rowLookup={ncertLookup}
                />
              ))
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
