"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  ChevronRight,
  FilterX,
  Layers,
  LayoutList,
  Tag,
  Trash2,
} from "lucide-react";
import { ActionModal } from "@/components/ui/action-modal";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useNotes } from "@/hooks/use-notes";
import { useSyllabusTree } from "@/hooks/use-syllabus";
import { getNoteSyllabusLinks } from "@/lib/note-links";
import { getNoteListTitle } from "@/lib/note-doc";
import {
  filterNotesForReader,
  hasActiveReaderFilter,
  type NoteReaderFilter,
} from "@/lib/note-filter";
import { DEFAULT_NCERT_SUBJECTS } from "@/lib/ncert-defaults";
import { formatNoteLinksSummary } from "@/lib/syllabus-progress";
import type { Note } from "@/types/prep";

const emptyFilter: NoteReaderFilter = {
  paperId: "",
  subjectTopicId: "",
  subtopicId: "",
};

const selectClass =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-500/40";

export default function NoteReaderPage() {
  const { notes, ready, remove } = useNotes();
  const { subjects, ready: treeReady } = useSyllabusTree();
  const [filter, setFilter] = useState<NoteReaderFilter>(emptyFilter);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const papers = subjects;

  function linkTreeForNote(n: Note) {
    return n.noteKind === "ncert" ? DEFAULT_NCERT_SUBJECTS : subjects;
  }

  const subjectTopics = useMemo(() => {
    if (!filter.paperId) return [];
    return subjects.find((s) => s.id === filter.paperId)?.topics ?? [];
  }, [subjects, filter.paperId]);

  const subtopics = useMemo(() => {
    if (!filter.subjectTopicId) return [];
    return (
      subjectTopics.find((t) => t.id === filter.subjectTopicId)?.subtopics ?? []
    );
  }, [subjectTopics, filter.subjectTopicId]);

  const filteredNotes = useMemo(
    () => filterNotesForReader(notes, filter),
    [notes, filter],
  );

  const selected = useMemo(
    () => filteredNotes.find((n) => n.id === selectedId) ?? null,
    [filteredNotes, selectedId],
  );

  useEffect(() => {
    if (!filteredNotes.length) {
      queueMicrotask(() => setSelectedId(null));
      return;
    }
    if (!filteredNotes.some((n) => n.id === selectedId)) {
      queueMicrotask(() => setSelectedId(filteredNotes[0].id));
    }
  }, [filteredNotes, selectedId]);

  function setPaper(id: string) {
    setFilter({ paperId: id, subjectTopicId: "", subtopicId: "" });
  }

  function setSubjectTopic(id: string) {
    setFilter((f) => ({ ...f, subjectTopicId: id, subtopicId: "" }));
  }

  function setSubtopic(id: string) {
    setFilter((f) => ({ ...f, subtopicId: id }));
  }

  const topicLabelForFilter = useMemo(() => {
    if (!filter.subjectTopicId) return "";
    const t = subjectTopics.find((x) => x.id === filter.subjectTopicId);
    return t?.label ?? "";
  }, [filter.subjectTopicId, subjectTopics]);

  const deleteTitle =
    deleteTarget &&
    (getNoteListTitle(deleteTarget) || "Untitled");

  return (
    <>
    <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#D6BCFA]">
            <BookOpenText className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              <GradientText as="span" className="font-bold">
                Note reader
              </GradientText>
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#A0AEC0]">
              <span className="inline-flex items-center gap-1.5">
                <LayoutList className="h-3.5 w-3.5 text-purple-300/90" />
                Read filtered notes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-amber-200/70" />
                Paper → subject → topic → subtopic
              </span>
            </p>
          </div>
        </div>
        {hasActiveReaderFilter(filter) && (
          <button
            type="button"
            onClick={() => setFilter(emptyFilter)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-[#A0AEC0] hover:bg-white/5 hover:text-white"
          >
            <FilterX className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>

      <GlassCard className="p-4 md:p-5">
        {!treeReady ? (
          <p className="text-sm text-[#A0AEC0]">Loading syllabus…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-purple-300/80" />
                Paper
              </span>
              <select
                className={selectClass}
                value={filter.paperId}
                onChange={(e) => setPaper(e.target.value)}
                aria-label="Filter by paper"
              >
                <option value="">All papers</option>
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
              <span className="inline-flex items-center gap-1.5">
                <BookOpenText className="h-3.5 w-3.5 text-purple-300/80" />
                Subject
              </span>
              <select
                className={selectClass}
                value={filter.subjectTopicId}
                onChange={(e) => setSubjectTopic(e.target.value)}
                disabled={!filter.paperId}
                aria-label="Filter by subject"
              >
                <option value="">
                  {filter.paperId ? "All subjects" : "Pick a paper first"}
                </option>
                {subjectTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
              <span className="inline-flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-purple-300/80" />
                Topic
              </span>
              <div
                className={`flex min-h-[42px] items-center rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm ${
                  filter.subjectTopicId ? "text-white/90" : "text-[#A0AEC0]"
                }`}
                title="Topic follows the subject you chose"
              >
                {filter.subjectTopicId
                  ? topicLabelForFilter || "—"
                  : "Select subject first"}
              </div>
            </label>

            <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
              <span className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-purple-300/80" />
                Subtopic
              </span>
              <select
                className={selectClass}
                value={filter.subtopicId}
                onChange={(e) => setSubtopic(e.target.value)}
                disabled={!filter.subjectTopicId}
                aria-label="Filter by subtopic"
              >
                <option value="">
                  {filter.subjectTopicId ? "All subtopics" : "Select subject first"}
                </option>
                {subtopics.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <GlassCard className="max-h-[70vh] overflow-hidden p-0">
          {!ready ? (
            <p className="p-4 text-sm text-[#A0AEC0]">Loading notes…</p>
          ) : filteredNotes.length === 0 ? (
            <p className="p-4 text-sm text-[#A0AEC0]">
              {hasActiveReaderFilter(filter)
                ? "No notes match these filters."
                : "No notes yet."}
            </p>
          ) : (
            <ul className="max-h-[70vh] divide-y divide-white/10 overflow-y-auto">
              {filteredNotes.map((n) => {
                const rowSummary = formatNoteLinksSummary(linkTreeForNote(n), n);
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(n.id)}
                      className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm transition-colors ${
                        n.id === selectedId
                          ? "bg-purple-500/15 text-white"
                          : "text-[#A0AEC0] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="font-medium text-white/95">
                        {getNoteListTitle(n)}
                      </span>
                      {rowSummary ? (
                        <span className="text-[10px] text-purple-300/90">
                          {rowSummary}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="min-h-[320px] p-6 md:p-8">
          {!selected ? (
            <p className="text-sm text-[#A0AEC0]">
              Select a note to read.
            </p>
          ) : (
            <NoteReaderDetail
              note={selected}
              subjects={linkTreeForNote(selected)}
              onDelete={() => setDeleteTarget(selected)}
            />
          )}
        </GlassCard>
      </div>
    </div>

    <ActionModal
      open={!!deleteTarget}
      onOpenChange={(open) => {
        if (!open) setDeleteTarget(null);
      }}
      title="Delete this note?"
      description={
        deleteTitle ? (
          <>
            This cannot be undone.
            <span className="mt-2 block font-medium text-white/90">
              {deleteTitle}
            </span>
          </>
        ) : (
          "This cannot be undone."
        )
      }
      icon={<Trash2 className="h-5 w-5" strokeWidth={1.75} />}
      actions={[
        {
          label: "Cancel",
          variant: "default",
          onClick: () => setDeleteTarget(null),
        },
        {
          label: "Delete",
          variant: "danger",
          onClick: async () => {
            const id = deleteTarget?.id;
            if (!id) return;
            await remove(id);
            setDeleteTarget(null);
          },
        },
      ]}
    />
    </>
  );
}

function NoteReaderDetail({
  note,
  subjects,
  onDelete,
}: {
  note: Note;
  subjects: import("@/types/prep").SyllabusSubject[];
  onDelete: () => void;
}) {
  const links = getNoteSyllabusLinks(note);
  const summary = formatNoteLinksSummary(subjects, note);

  return (
    <article className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-3xl font-normal text-white md:text-4xl">
            {getNoteListTitle(note)}
          </h2>
          {summary ? (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#A0AEC0]">
              <Tag className="h-3.5 w-3.5 shrink-0 text-purple-300/80" />
              {summary}
            </p>
          ) : null}
          {links.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {links.map((l) => {
                const paper = subjects.find((s) => s.id === l.subjectId)?.label;
                const topic = subjects
                  .flatMap((s) => s.topics)
                  .find((t) => t.id === l.topicId)?.label;
                const sub = subjects
                  .flatMap((s) => s.topics)
                  .flatMap((t) => t.subtopics)
                  .find((st) => st.id === l.subtopicId)?.label;
                return (
                  <li
                    key={`${l.subjectId}-${l.topicId}-${l.subtopicId}`}
                    className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-[#A0AEC0]"
                  >
                    {[paper, topic, sub].filter(Boolean).join(" · ")}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </header>
      <div
        className="note-reader-body max-w-none text-base leading-relaxed text-white/90 [&_a]:text-[#D6BCFA] [&_blockquote]:border-l-purple-400/40 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_img]:rounded-xl [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: note.body || "<p></p>" }}
      />
    </article>
  );
}
