"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BookMarked,
  Braces,
  GitBranch,
  ImageIcon,
  Link2,
  Minus,
  Play,
  Plus,
  PlusCircle,
  Save,
  Search,
  Table2,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditorFormatToolbar } from "@/components/notes/editor-format-toolbar";
import { NoteHeading } from "@/components/notes/note-heading-extension";
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { normalizeEditorContent } from "@/lib/note-doc";
import { getNoteListTitle } from "@/lib/note-doc";
import {
  labelForStandard,
  NCERT_STANDARD_OPTIONS,
  topicIdForStandard,
} from "@/lib/ncert-defaults";
import {
  dedupeSyllabusLinks,
  resolveSyllabusLinkFromSubtopicId,
} from "@/lib/note-links";
import type {
  Note,
  NoteKind,
  NoteStudyStage,
  SyllabusLink,
  SyllabusModel,
  SyllabusSubject,
} from "@/types/prep";

function safeUrl(input: string): string | null {
  try {
    const u = new URL(input.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

const glassPanel =
  "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-xl";

const selectDark =
  "rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-sm text-white focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-500/40";

type MediumNoteEditorProps = {
  title: string;
  onTitleChange: (v: string) => void;
  bodyHtml: string;
  onBodyHtmlChange: (v: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  canDelete: boolean;
  treeReady: boolean;
  /** GS syllabus tree (papers). */
  gsSubjects: SyllabusSubject[];
  syllabus: SyllabusModel;
  /** NCERT class/chapter tree. */
  ncertSubjects: SyllabusSubject[];
  noteKind: NoteKind;
  onNoteKindChange: (k: NoteKind) => void;
  ncertStandard: string;
  onNcertStandardChange: (v: string) => void;
  ncertSubjectId: string;
  onNcertSubjectIdChange: (v: string) => void;
  dailyNewsDate: string;
  onDailyNewsDateChange: (v: string) => void;
  currentAffairsStartDate: string;
  onCurrentAffairsStartDateChange: (v: string) => void;
  currentAffairsEndDate: string;
  onCurrentAffairsEndDateChange: (v: string) => void;
  currentEventsTopics: string[];
  currentEventsTopicId: string;
  onCurrentEventsTopicIdChange: (v: string) => void;
  studyStage: NoteStudyStage;
  onStudyStageChange: (v: NoteStudyStage) => void;
  revisionNumber: number;
  onRevisionNumberChange: (v: number) => void;
  syllabusLinks: SyllabusLink[];
  onSyllabusLinksChange: (links: SyllabusLink[]) => void;
  notes: Note[];
  notesReady: boolean;
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  linkSummary?: string | null;
};

function SyllabusLinkRow({
  syllabus,
  link,
  index,
  onChange,
  onRemove,
}: {
  syllabus: SyllabusModel;
  link: SyllabusLink;
  index: number;
  onChange: (index: number, next: SyllabusLink) => void;
  onRemove: (index: number) => void;
}) {
  const specificOptions = useMemo(
    () =>
      syllabus.papers.flatMap((paper) =>
        paper.subjects.flatMap((subject) =>
          subject.specificSubjects.map((specific) => ({
            paper,
            subject,
            specific,
          })),
        ),
      ),
    [syllabus],
  );

  const selectedSpecific = specificOptions.find(
    (option) => option.paper.id === link.subjectId && option.specific.id === link.topicId,
  );

  const areas = selectedSpecific?.specific.areas ?? [];
  const selectedArea = areas.find((area) =>
    area.topics.some((topic) => topic.id === link.subtopicId),
  );
  const selectedAreaId = selectedArea?.id ?? "";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex min-w-[160px] flex-1 flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
        <span className="inline-flex items-center gap-1.5">
          <BookMarked className="h-3.5 w-3.5 text-purple-300/80" />
          Specific subject
        </span>
        <select
          value={link.topicId ? `${link.subjectId}:${link.topicId}` : ""}
          onChange={(e) => {
            const [paperId, specificId] = e.target.value.split(":");
            onChange(index, {
              subjectId: paperId ?? "",
              topicId: specificId ?? "",
              subtopicId: "",
            });
          }}
          className={selectDark}
        >
          <option value="">Select specific subject</option>
          {specificOptions.map(({ paper, subject, specific }) => (
            <option key={`${paper.id}:${specific.id}`} value={`${paper.id}:${specific.id}`}>
              {subject.label} - {specific.label} ({paper.label})
            </option>
          ))}
        </select>
      </label>

      {selectedSpecific ? (
        <label className="flex min-w-[160px] flex-1 flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
          <span className="inline-flex items-center gap-1.5">
            <Tags className="h-3.5 w-3.5 text-purple-300/80" />
            Area
          </span>
          <select
            value={selectedAreaId}
            onChange={(e) => {
              const area = areas.find((x) => x.id === e.target.value);
              onChange(index, {
                ...link,
                subtopicId: area?.topics[0]?.id ?? "",
              });
            }}
            className={selectDark}
          >
            <option value="">Select area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {selectedSpecific && selectedArea ? (
        <label className="flex min-w-[160px] flex-1 flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
          <span className="inline-flex items-center gap-1.5">
            <Tags className="h-3.5 w-3.5 text-purple-300/80" />
            Topic
          </span>
          <select
            value={link.subtopicId}
            onChange={(e) =>
              onChange(index, { ...link, subtopicId: e.target.value })
            }
            className={selectDark}
          >
            <option value="">Select topic</option>
            {selectedArea.topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl border border-white/15 text-[#A0AEC0] hover:bg-red-500/10 hover:text-red-300"
        title="Remove link"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function CurrentEventsSelect({
  topics,
  value,
  onChange,
}: {
  topics: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
      Current events topic
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectDark}
      >
        <option value="">Select current events topic</option>
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MediumNoteEditor({
  title,
  onTitleChange,
  bodyHtml,
  onBodyHtmlChange,
  onSave,
  onDelete,
  canDelete,
  treeReady,
  gsSubjects,
  syllabus,
  ncertSubjects,
  noteKind,
  onNoteKindChange,
  ncertStandard,
  onNcertStandardChange,
  ncertSubjectId,
  onNcertSubjectIdChange,
  dailyNewsDate,
  onDailyNewsDateChange,
  currentAffairsStartDate,
  onCurrentAffairsStartDateChange,
  currentAffairsEndDate,
  onCurrentAffairsEndDateChange,
  currentEventsTopics,
  currentEventsTopicId,
  onCurrentEventsTopicIdChange,
  studyStage,
  onStudyStageChange,
  revisionNumber,
  onRevisionNumberChange,
  syllabusLinks,
  onSyllabusLinksChange,
  notes,
  notesReady,
  activeNoteId,
  onSelectNote,
  linkSummary,
}: MediumNoteEditorProps) {
  const [plusOpen, setPlusOpen] = useState(true);
  const [affairBusy, setAffairBusy] = useState(false);
  const [affairHint, setAffairHint] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const selectedNcertClass = ncertSubjects[0]?.topics.find(
    (topic) => topic.id === topicIdForStandard(ncertStandard),
  );

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        underline: {},
        bulletList: { HTMLAttributes: { class: "list-disc pl-6 my-3 text-white/90" } },
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-6 my-3 text-white/90" },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "border-l-4 border-purple-400/40 pl-4 my-4 text-white/85 italic bg-white/[0.03] py-2 rounded-r-lg",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "rounded-xl bg-black/50 text-[#E9D8FD]/95 p-4 my-4 text-sm font-mono overflow-x-auto border border-white/10",
          },
        },
        horizontalRule: {
          HTMLAttributes: { class: "my-8 border-white/20" },
        },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            class: "text-[#D6BCFA] underline decoration-[#D6BCFA]/40 underline-offset-2",
          },
        },
      }),
      NoteHeading,
      Placeholder.configure({
        showOnlyCurrent: false,
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            const level = node.attrs.level as number;
            if (level === 2) return "Section heading";
            return "Subheading";
          }
          return "Write here…";
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto my-6 mx-auto block ring-1 ring-white/10",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class:
            "rounded-xl overflow-hidden my-6 w-full max-w-full aspect-video border border-white/10",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "my-6 w-full border-collapse overflow-hidden rounded-xl border border-white/15",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: normalizeEditorContent(bodyHtml),
    editorProps: {
      attributes: {
        class:
          "tiptap focus:outline-none min-h-[64px] px-1 py-2 text-lg leading-[1.75] text-white/95 [&_p]:my-3 [&_p.is-empty:first-child]:mt-1 [&_strong]:text-white [&_em]:text-white/95",
      },
    },
    onCreate: () => {},
    onUpdate: ({ editor: ed }) => {
      onBodyHtmlChange(ed.getHTML());
    },
  });

  function insertImageFromPrompt(label: string) {
    if (!editor) return;
    const raw = window.prompt(`${label} — paste image URL (https)`);
    const url = raw ? safeUrl(raw) : null;
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  function insertYoutube() {
    if (!editor) return;
    const raw = window.prompt("Paste YouTube video URL");
    const url = raw ? safeUrl(raw) : null;
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  function insertEmbedLink() {
    if (!editor) return;
    const raw = window.prompt("Paste URL to embed as link");
    const url = raw ? safeUrl(raw) : null;
    if (!url) return;
    editor
      .chain()
      .focus()
      .insertContent(
        `<p><a href="${url}" rel="noopener noreferrer" target="_blank" class="text-[#D6BCFA] underline">${url}</a></p>`,
      )
      .run();
  }

  function insertCodeBlock() {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
  }

  /** New section: divider + subheading (H2); Enter from H2 continues as normal paragraphs. */
  function insertSectionBreak() {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setHorizontalRule()
      .insertContent({ type: "heading", attrs: { level: 2 } })
      .run();
  }

  function insertTable() {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }

  function insertTimeline() {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent(
        "<h2>Timeline</h2><ul><li><strong>Phase 1</strong> - First reading</li><li><strong>Phase 2</strong> - Revision and consolidation</li><li><strong>Phase 3</strong> - PYQ practice and tests</li></ul>",
      )
      .run();
  }

  const insertBtn =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600/85 text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] transition-transform hover:scale-105 hover:bg-purple-500 active:scale-95";

  function patchLink(i: number, next: SyllabusLink) {
    const copy = [...syllabusLinks];
    copy[i] = next;
    onSyllabusLinksChange(copy);
  }

  function removeLink(i: number) {
    onSyllabusLinksChange(syllabusLinks.filter((_, j) => j !== i));
  }

  function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  async function suggestNewsTags() {
    const raw = `${title}\n${stripHtml(bodyHtml)}`;
    if (raw.length < 20) {
      setAffairHint("Add a title or body text first.");
      return;
    }
    setAffairBusy(true);
    setAffairHint(null);
    try {
      const res = await fetch("/api/current-affairs/map", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rawText: raw, subjects: gsSubjects }),
      });
      if (!res.ok) throw new Error("map failed");
      const data = (await res.json()) as {
        subtopicIds: string[];
        confidence: number;
      };
      const first = data.subtopicIds[0];
      if (!first) {
        setAffairHint("No strong syllabus match—tag manually below.");
        return;
      }
      const link = resolveSyllabusLinkFromSubtopicId(gsSubjects, first);
      if (!link) {
        setAffairHint("Could not resolve tag.");
        return;
      }
      onSyllabusLinksChange(dedupeSyllabusLinks([...syllabusLinks, link]));
      setAffairHint(`Added suggested GS tag (${data.confidence}% match).`);
    } catch {
      setAffairHint("Suggestion failed. Try again.");
    } finally {
      setAffairBusy(false);
    }
  }

  return (
    <div className={`overflow-hidden ${glassPanel}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5 md:py-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 md:gap-3">
          <span className="hidden shrink-0 font-semibold tracking-tight text-white sm:inline">
            Prep<span className="text-[#C8A2C8]">Vyuha</span>
          </span>
          {notesReady && notes.length > 0 ? (
            <select
              value={activeNoteId ?? ""}
              onChange={(e) => onSelectNote(e.target.value)}
              className="min-w-0 max-w-[min(100%,20rem)] flex-1 rounded-xl border border-white/15 bg-black/40 py-2 pl-3 pr-8 text-sm text-white focus:border-purple-400/50 focus:outline-none sm:max-w-xs sm:flex-none md:max-w-md"
              aria-label="Open note"
            >
              {notes.map((n) => (
                <option key={n.id} value={n.id}>
                  {getNoteListTitle(n)}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-[#A0AEC0]">Loading notes…</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canDelete && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/35 bg-purple-500/20 px-5 py-2 text-sm font-medium text-[#E9D8FD] shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:bg-purple-500/30"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </header>

      <div className="border-b border-white/10 px-4 py-4 md:px-5">
        <div className="mb-4 space-y-3">
          <div className="max-w-md">
            <PomodoroTimer
              compact
              noteId={activeNoteId}
              title={title || "Note focus"}
            />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
            Note source
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/95">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="noteKind"
                checked={noteKind === "daily_news"}
                onChange={() => onNoteKindChange("daily_news")}
                className="accent-purple-500"
              />
              Daily newspaper
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="noteKind"
                checked={noteKind === "current_affairs"}
                onChange={() => onNoteKindChange("current_affairs")}
                className="accent-purple-500"
              />
              Current affairs
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="noteKind"
                checked={noteKind === "ncert"}
                onChange={() => onNoteKindChange("ncert")}
                className="accent-purple-500"
              />
              NCERT
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="noteKind"
                checked={noteKind === "gs_paper"}
                onChange={() => onNoteKindChange("gs_paper")}
                className="accent-purple-500"
              />
              GS paper
            </label>
          </div>
          {noteKind === "ncert" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
                Class
                <select
                  value={ncertStandard}
                  onChange={(e) => onNcertStandardChange(e.target.value)}
                  className={selectDark}
                >
                  <option value="">Select class</option>
                  {NCERT_STANDARD_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                      {labelForStandard(s)}
                  </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
                NCERT subject
                <select
                  value={ncertSubjectId}
                  onChange={(e) => onNcertSubjectIdChange(e.target.value)}
                  disabled={!ncertStandard}
                  className={selectDark}
                >
                  <option value="">Select subject</option>
                  {(selectedNcertClass?.subtopics ?? []).map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {noteKind === "daily_news" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
                Newspaper date
                <input
                  type="date"
                  value={dailyNewsDate}
                  onChange={(e) => onDailyNewsDateChange(e.target.value)}
                  className={selectDark}
                />
              </label>
              <CurrentEventsSelect
                topics={currentEventsTopics}
                value={currentEventsTopicId}
                onChange={onCurrentEventsTopicIdChange}
              />
            </div>
          ) : null}

          {noteKind === "current_affairs" ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
                From
                <input
                  type="date"
                  value={currentAffairsStartDate}
                  onChange={(e) =>
                    onCurrentAffairsStartDateChange(e.target.value)
                  }
                  className={selectDark}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
                To
                <input
                  type="date"
                  value={currentAffairsEndDate}
                  onChange={(e) =>
                    onCurrentAffairsEndDateChange(e.target.value)
                  }
                  className={selectDark}
                />
              </label>
              <CurrentEventsSelect
                topics={currentEventsTopics}
                value={currentEventsTopicId}
                onChange={onCurrentEventsTopicIdChange}
              />
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
              Reading stage
              <select
                value={studyStage}
                onChange={(e) =>
                  onStudyStageChange(e.target.value as NoteStudyStage)
                }
                className={selectDark}
              >
                <option value="first_read">First read</option>
                <option value="revision">Revision</option>
              </select>
            </label>
            {studyStage === "revision" ? (
              <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
                Revision number
                <input
                  type="number"
                  min={1}
                  value={revisionNumber}
                  onChange={(e) =>
                    onRevisionNumberChange(Number(e.target.value) || 1)
                  }
                  className={selectDark}
                />
              </label>
            ) : null}
          </div>
        </div>

        {(noteKind === "daily_news" || noteKind === "current_affairs") && (
          <div className="mb-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="text-xs font-medium text-[#D6BCFA]">
              Map to GS syllabus
            </p>
            <p className="mt-1 text-xs text-[#A0AEC0]">
              Uses your title + note body to suggest a subtopic link (same as the old
              mapper).
            </p>
            <button
              type="button"
              disabled={affairBusy}
              onClick={() => void suggestNewsTags()}
              className="mt-3 rounded-lg border border-purple-400/35 bg-purple-500/15 px-3 py-2 text-xs font-medium text-[#E9D8FD] hover:bg-purple-500/25 disabled:opacity-50"
            >
              {affairBusy ? "Suggesting…" : "Suggest GS tags"}
            </button>
            {affairHint ? (
              <p className="mt-2 text-xs text-[#A0AEC0]">{affairHint}</p>
            ) : null}
          </div>
        )}

        {linkSummary ? (
          <p className="mb-3 text-xs text-[#A0AEC0]">
            Linked: <span className="text-white/90">{linkSummary}</span>
          </p>
        ) : null}
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
          <Tags className="h-4 w-4 text-purple-300/90" strokeWidth={2} />
          GS syllabus tags
        </div>
        {!treeReady ? (
          <p className="text-sm text-[#A0AEC0]">Loading…</p>
        ) : (
          <div className="space-y-3">
            {syllabusLinks.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-[#A0AEC0]">
                <Tags className="h-4 w-4 shrink-0 opacity-50" />
                No topics tagged yet
              </p>
            ) : (
              syllabusLinks.map((link, index) => (
                <SyllabusLinkRow
                  key={`${index}-${link.subjectId}-${link.topicId}-${link.subtopicId}`}
                  syllabus={syllabus}
                  link={link}
                  index={index}
                  onChange={patchLink}
                  onRemove={removeLink}
                />
              ))
            )}
            <button
              type="button"
              onClick={() => {
                const blank: SyllabusLink = {
                  subjectId: "",
                  topicId: "",
                  subtopicId: "",
                };
                onSyllabusLinksChange([...syllabusLinks, blank]);
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#D6BCFA] hover:text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add tag
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 pb-12 pt-6 md:px-8 md:pb-20 md:pt-8 lg:px-12">
        {editor ? (
          <div className="sticky top-3 z-20 mb-4 rounded-xl border border-white/10 bg-[#0f0f14]/90 px-2 py-2 backdrop-blur-xl">
            <EditorFormatToolbar editor={editor} />
          </div>
        ) : (
          <div className="mb-4 h-10 rounded-lg border border-white/10 bg-black/20" />
        )}

        <label className="sr-only" htmlFor="note-title-input">
          Title
        </label>
        <input
          ref={titleInputRef}
          id="note-title-input"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && editor) {
              e.preventDefault();
              editor.chain().focus("end").run();
            }
          }}
          placeholder="Title"
          autoComplete="off"
          className="mb-6 w-full border-none bg-transparent font-serif text-4xl font-normal text-white placeholder:text-white/30 focus:outline-none focus:ring-0 md:text-[2.75rem] md:leading-tight"
        />

        <EditorContent editor={editor} />

        <div className="mt-0 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPlusOpen((o) => !o)}
            className={insertBtn}
            title={plusOpen ? "Hide insert menu" : "Show insert menu"}
            aria-expanded={plusOpen}
          >
            {plusOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>

          {plusOpen && (
            <>
              <button
                type="button"
                className={insertBtn}
                title="Add image"
                onClick={() => insertImageFromPrompt("Add image")}
              >
                <ImageIcon className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={insertBtn}
                title="Image URL (e.g. Unsplash)"
                onClick={() =>
                  insertImageFromPrompt(
                    "Image URL — paste direct image link (e.g. Unsplash)",
                  )
                }
              >
                <Search className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={insertBtn}
                title="Add video"
                onClick={insertYoutube}
              >
                <Play className="h-4 w-4" fill="currentColor" />
              </button>
              <button
                type="button"
                className={insertBtn}
                title="Add embed link"
                onClick={insertEmbedLink}
              >
                <Link2 className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={insertBtn}
                title="Add code block"
                onClick={insertCodeBlock}
              >
                <Braces className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={insertBtn}
                title="Section break — divider + subheading (H2)"
                onClick={insertSectionBreak}
              >
                <Minus className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={insertBtn}
                title="Insert table"
                onClick={insertTable}
              >
                <Table2 className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className={insertBtn}
                title="Insert timeline template"
                onClick={insertTimeline}
              >
                <GitBranch className="h-4 w-4" strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
