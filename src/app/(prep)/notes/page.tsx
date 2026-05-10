"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { MediumNoteEditor } from "@/components/notes/medium-note-editor";
import { ActionModal } from "@/components/ui/action-modal";
import { useNotes } from "@/hooks/use-notes";
import { useRevision } from "@/hooks/use-revision";
import { useSyllabusTree } from "@/hooks/use-syllabus";
import { dedupeSyllabusLinks, getNoteSyllabusLinks } from "@/lib/note-links";
import {
  EMPTY_EDITOR_BODY,
  getNoteListTitle,
  migrateNoteToEditorParts,
} from "@/lib/note-doc";
import {
  DEFAULT_NCERT_SUBJECTS,
} from "@/lib/ncert-defaults";
import { CURRENT_EVENTS_SECTION } from "@/lib/syllabus-defaults";
import { formatNoteLinksSummary } from "@/lib/syllabus-progress";
import type { Note, NoteKind, NoteStudyStage, SyllabusLink } from "@/types/prep";

type PendingNav =
  | { kind: "select"; id: string }
  | null;

function applyNoteToForm(n: Note) {
  const { title, body } = migrateNoteToEditorParts(n.title, n.body);
  return {
    title,
    body,
    syllabusLinks: getNoteSyllabusLinks(n),
    noteKind: (n.noteKind ?? "gs_paper") as NoteKind,
    ncertStandard: n.ncertStandard ?? "",
    ncertSubjectId: n.ncertSubjectId ?? "",
    dailyNewsDate: n.dailyNewsDate ?? "",
    currentAffairsStartDate: n.currentAffairsStartDate ?? "",
    currentAffairsEndDate: n.currentAffairsEndDate ?? "",
    currentEventsTopicId: n.currentEventsTopicId ?? "",
    studyStage: n.studyStage ?? "first_read",
    revisionNumber: n.revisionNumber ?? 1,
  };
}

export default function NotesPage() {
  const { notes, upsert, remove, ready } = useNotes();
  const { createNoteAlerts } = useRevision();
  const { subjects, syllabus, ready: treeReady } = useSyllabusTree();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [syllabusLinks, setSyllabusLinks] = useState<SyllabusLink[]>([]);
  const [noteKind, setNoteKind] = useState<NoteKind>("gs_paper");
  const [ncertStandard, setNcertStandard] = useState("");
  const [ncertSubjectId, setNcertSubjectId] = useState("");
  const [dailyNewsDate, setDailyNewsDate] = useState("");
  const [currentAffairsStartDate, setCurrentAffairsStartDate] = useState("");
  const [currentAffairsEndDate, setCurrentAffairsEndDate] = useState("");
  const [currentEventsTopicId, setCurrentEventsTopicId] = useState("");
  const [studyStage, setStudyStage] = useState<NoteStudyStage>("first_read");
  const [revisionNumber, setRevisionNumber] = useState(1);
  const bootstrapped = useRef(false);
  const dirtyRef = useRef(false);
  const prevActiveId = useRef<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingNav, setPendingNav] = useState<PendingNav>(null);

  const createNew = useCallback(() => {
    setActiveId(null);
    prevActiveId.current = null;
    dirtyRef.current = false;
    setTitle("");
    setBody(EMPTY_EDITOR_BODY);
    setSyllabusLinks([]);
    setNoteKind("gs_paper");
    setNcertStandard("");
    setNcertSubjectId("");
    setDailyNewsDate("");
    setCurrentAffairsStartDate("");
    setCurrentAffairsEndDate("");
    setCurrentEventsTopicId("");
    setStudyStage("first_read");
    setRevisionNumber(1);
  }, []);

  useEffect(() => {
    if (!ready || bootstrapped.current) return;
    bootstrapped.current = true;
    queueMicrotask(() => {
      if (notes.length > 0) {
        setActiveId(notes[0].id);
      } else {
        createNew();
      }
    });
  }, [ready, notes, createNew]);

  useEffect(() => {
    if (!activeId) {
      prevActiveId.current = null;
      dirtyRef.current = false;
      queueMicrotask(() => {
        setTitle("");
        setBody("");
        setSyllabusLinks([]);
        setNoteKind("gs_paper");
        setNcertStandard("");
        setNcertSubjectId("");
        setDailyNewsDate("");
        setCurrentAffairsStartDate("");
        setCurrentAffairsEndDate("");
        setCurrentEventsTopicId("");
        setStudyStage("first_read");
        setRevisionNumber(1);
      });
      return;
    }

    const n = notes.find((x) => x.id === activeId);
    if (!n) return;

    const switchedNote = prevActiveId.current !== activeId;
    if (switchedNote) {
      prevActiveId.current = activeId;
      dirtyRef.current = false;
      const f = applyNoteToForm(n);
      queueMicrotask(() => {
        setTitle(f.title);
        setBody(f.body);
        setSyllabusLinks(f.syllabusLinks);
        setNoteKind(f.noteKind);
        setNcertStandard(f.ncertStandard);
        setNcertSubjectId(f.ncertSubjectId);
        setDailyNewsDate(f.dailyNewsDate);
        setCurrentAffairsStartDate(f.currentAffairsStartDate);
        setCurrentAffairsEndDate(f.currentAffairsEndDate);
        setCurrentEventsTopicId(f.currentEventsTopicId);
        setStudyStage(f.studyStage);
        setRevisionNumber(f.revisionNumber);
      });
      return;
    }

    if (dirtyRef.current) return;

    const f = applyNoteToForm(n);
    queueMicrotask(() => {
      setTitle(f.title);
      setBody(f.body);
      setSyllabusLinks(f.syllabusLinks);
      setNoteKind(f.noteKind);
      setNcertStandard(f.ncertStandard);
      setNcertSubjectId(f.ncertSubjectId);
      setDailyNewsDate(f.dailyNewsDate);
      setCurrentAffairsStartDate(f.currentAffairsStartDate);
      setCurrentAffairsEndDate(f.currentAffairsEndDate);
      setCurrentEventsTopicId(f.currentEventsTopicId);
      setStudyStage(f.studyStage);
      setRevisionNumber(f.revisionNumber);
    });
  }, [activeId, notes]);

  const select = useCallback((note: Note) => {
    setActiveId(note.id);
  }, []);

  const trySelectNote = useCallback(
    (id: string) => {
      if (id === activeId) return;
      if (dirtyRef.current) {
        setPendingNav({ kind: "select", id });
        setUnsavedModalOpen(true);
        return;
      }
      const n = notes.find((x) => x.id === id);
      if (n) select(n);
    },
    [activeId, notes, select],
  );

  function setTitleTracked(v: string) {
    dirtyRef.current = true;
    setTitle(v);
  }

  function setBodyTracked(v: string) {
    dirtyRef.current = true;
    setBody(v);
  }

  function setSyllabusLinksTracked(v: SyllabusLink[]) {
    dirtyRef.current = true;
    setSyllabusLinks(v);
  }

  function setNoteKindTracked(k: NoteKind) {
    dirtyRef.current = true;
    setNoteKind(k);
    if (k !== "ncert") {
      setNcertStandard("");
      setNcertSubjectId("");
    }
    if (k !== "daily_news") setDailyNewsDate("");
    if (k !== "current_affairs") {
      setCurrentAffairsStartDate("");
      setCurrentAffairsEndDate("");
    }
    if (k !== "daily_news" && k !== "current_affairs") {
      setCurrentEventsTopicId("");
    }
  }

  function setNcertStandardTracked(v: string) {
    dirtyRef.current = true;
    setNcertStandard(v);
    setNcertSubjectId("");
  }

  function setNcertSubjectIdTracked(v: string) {
    dirtyRef.current = true;
    setNcertSubjectId(v);
  }

  function setDailyNewsDateTracked(v: string) {
    dirtyRef.current = true;
    setDailyNewsDate(v);
  }

  function setCurrentAffairsStartDateTracked(v: string) {
    dirtyRef.current = true;
    setCurrentAffairsStartDate(v);
  }

  function setCurrentAffairsEndDateTracked(v: string) {
    dirtyRef.current = true;
    setCurrentAffairsEndDate(v);
  }

  function setCurrentEventsTopicIdTracked(v: string) {
    dirtyRef.current = true;
    setCurrentEventsTopicId(v);
  }

  function setStudyStageTracked(v: NoteStudyStage) {
    dirtyRef.current = true;
    setStudyStage(v);
    if (v === "first_read") setRevisionNumber(1);
  }

  function setRevisionNumberTracked(v: number) {
    dirtyRef.current = true;
    setRevisionNumber(Math.max(1, v));
  }

  function hasMeaningfulBody(html: string): boolean {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 0;
  }

  const save = useCallback(async (): Promise<boolean> => {
    const noteId = activeId ?? crypto.randomUUID();

    const cleaned = dedupeSyllabusLinks(
      syllabusLinks.filter(
        (l) => l.subjectId && l.topicId && l.subtopicId,
      ),
    );

    const titleText = title.trim();
    const hasBody = hasMeaningfulBody(body);
    if (!titleText && !hasBody) {
      setSaveError("Empty notes are not saved. Add a title or note content.");
      return false;
    }
    if (cleaned.length === 0) {
      setSaveError("Tag at least one subject/topic/subtopic before saving.");
      return false;
    }

    if (noteKind === "ncert") {
      if (!ncertStandard || !ncertSubjectId) {
        setSaveError("Select an NCERT class and subject before saving.");
        return false;
      }
    }

    if (noteKind === "daily_news" && !dailyNewsDate) {
      setSaveError("Select the daily newspaper date before saving.");
      return false;
    }

    if (
      (noteKind === "daily_news" || noteKind === "current_affairs") &&
      !currentEventsTopicId
    ) {
      setSaveError("Select a current events topic before saving.");
      return false;
    }

    if (noteKind === "current_affairs") {
      if (!currentAffairsStartDate || !currentAffairsEndDate) {
        setSaveError("Select the current affairs date range before saving.");
        return false;
      }
      if (currentAffairsStartDate > currentAffairsEndDate) {
        setSaveError("Current affairs start date cannot be after end date.");
        return false;
      }
    }

    const b = body.trim() ? body : EMPTY_EDITOR_BODY;
    const t = titleText || "Untitled";
    const savedAt = Date.now();
    const stageText =
      studyStage === "revision" ? `revision ${revisionNumber}` : "first read";
    const completedSyllabusTopicIds =
      noteKind === "ncert"
        ? []
        : window.confirm(
            `Mark the selected GS topic${cleaned.length > 1 ? "s" : ""} as finished for ${stageText}?`,
          )
        ? cleaned.map((link) => link.subtopicId)
        : [];
    const completedNcertBookIds =
      noteKind === "ncert" && ncertSubjectId
        ? window.confirm(
            `Mark the selected NCERT topic as finished for ${stageText}?`,
          )
          ? [ncertSubjectId]
          : []
        : [];

    const savedNote = {
      id: noteId,
      title: t,
      body: b,
      updatedAt: savedAt,
      syllabusLinks: cleaned,
      noteKind,
      ncertStandard: noteKind === "ncert" ? ncertStandard : undefined,
      ncertSubjectId: noteKind === "ncert" ? ncertSubjectId : undefined,
      dailyNewsDate: noteKind === "daily_news" ? dailyNewsDate : undefined,
      currentAffairsStartDate:
        noteKind === "current_affairs" ? currentAffairsStartDate : undefined,
      currentAffairsEndDate:
        noteKind === "current_affairs" ? currentAffairsEndDate : undefined,
      currentEventsTopicId:
        noteKind === "daily_news" || noteKind === "current_affairs"
          ? currentEventsTopicId
          : undefined,
      studyStage,
      revisionNumber: studyStage === "revision" ? revisionNumber : undefined,
      completedSyllabusTopicIds,
      completedNcertBookIds,
    };

    const persisted = await upsert(savedNote);
    await createNoteAlerts({
      id: noteId,
      title: t,
      updatedAt: persisted?.updatedAt ?? savedAt,
    });
    if (!activeId) setActiveId(noteId);
    dirtyRef.current = false;
    return true;
  }, [
    activeId,
    body,
    currentAffairsEndDate,
    currentAffairsStartDate,
    currentEventsTopicId,
    dailyNewsDate,
    ncertStandard,
    ncertSubjectId,
    noteKind,
    revisionNumber,
    syllabusLinks,
    studyStage,
    title,
    upsert,
    createNoteAlerts,
  ]);

  const handleDelete = useCallback(async () => {
    if (!activeId) return;
    const id = activeId;
    const others = notes.filter((x) => x.id !== id);
    await remove(id);
    dirtyRef.current = false;
    if (others.length > 0) {
      setActiveId(others[0].id);
    } else {
      createNew();
    }
  }, [activeId, notes, remove, createNew]);

  const cancelUnsavedNav = useCallback(() => {
    setUnsavedModalOpen(false);
    setPendingNav(null);
  }, []);

  const confirmUnsavedDiscard = useCallback(() => {
    dirtyRef.current = false;
    const p = pendingNav;
    setUnsavedModalOpen(false);
    setPendingNav(null);
    if (!p) return;
    const n = notes.find((x) => x.id === p.id);
    if (n) select(n);
  }, [pendingNav, notes, select]);

  const confirmUnsavedSave = useCallback(async () => {
    const p = pendingNav;
    const saved = await save();
    if (!saved) return;
    setUnsavedModalOpen(false);
    setPendingNav(null);
    if (!p) return;
    const n = notes.find((x) => x.id === p.id);
    if (n) select(n);
  }, [pendingNav, save, notes, select]);

  const linkSummaryText = useMemo(() => {
    if (!activeId) return null;
    const noteLike: Note = {
      id: activeId,
      title,
      body,
      updatedAt: 0,
      syllabusLinks,
      noteKind,
      ncertStandard: ncertStandard || undefined,
      ncertSubjectId: ncertSubjectId || undefined,
      dailyNewsDate: dailyNewsDate || undefined,
      currentAffairsStartDate: currentAffairsStartDate || undefined,
      currentAffairsEndDate: currentAffairsEndDate || undefined,
      currentEventsTopicId: currentEventsTopicId || undefined,
      studyStage,
      revisionNumber: studyStage === "revision" ? revisionNumber : undefined,
    };
    return formatNoteLinksSummary(subjects, noteLike);
  }, [
    activeId,
    title,
    body,
    syllabusLinks,
    subjects,
    noteKind,
    ncertStandard,
    ncertSubjectId,
    dailyNewsDate,
    currentAffairsStartDate,
    currentAffairsEndDate,
    currentEventsTopicId,
    studyStage,
    revisionNumber,
  ]);

  const deletePreviewTitle = useMemo(
    () => getNoteListTitle({ title, body }),
    [title, body],
  );

  return (
    <>
      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <MediumNoteEditor
          key={activeId ?? "draft-none"}
          title={title}
          onTitleChange={setTitleTracked}
          bodyHtml={body}
          onBodyHtmlChange={setBodyTracked}
          onSave={() => void save()}
          onDelete={activeId ? () => setDeleteModalOpen(true) : undefined}
          canDelete={!!activeId}
          treeReady={treeReady}
          gsSubjects={subjects}
          syllabus={syllabus}
          ncertSubjects={DEFAULT_NCERT_SUBJECTS}
          noteKind={noteKind}
          onNoteKindChange={setNoteKindTracked}
          ncertStandard={ncertStandard}
          onNcertStandardChange={setNcertStandardTracked}
          ncertSubjectId={ncertSubjectId}
          onNcertSubjectIdChange={setNcertSubjectIdTracked}
          dailyNewsDate={dailyNewsDate}
          onDailyNewsDateChange={setDailyNewsDateTracked}
          currentAffairsStartDate={currentAffairsStartDate}
          onCurrentAffairsStartDateChange={setCurrentAffairsStartDateTracked}
          currentAffairsEndDate={currentAffairsEndDate}
          onCurrentAffairsEndDateChange={setCurrentAffairsEndDateTracked}
          currentEventsTopics={CURRENT_EVENTS_SECTION.areas}
          currentEventsTopicId={currentEventsTopicId}
          onCurrentEventsTopicIdChange={setCurrentEventsTopicIdTracked}
          studyStage={studyStage}
          onStudyStageChange={setStudyStageTracked}
          revisionNumber={revisionNumber}
          onRevisionNumberChange={setRevisionNumberTracked}
          syllabusLinks={syllabusLinks}
          onSyllabusLinksChange={setSyllabusLinksTracked}
          notes={notes}
          notesReady={ready}
          activeNoteId={activeId}
          onSelectNote={trySelectNote}
          linkSummary={linkSummaryText}
        />
      </div>

      <ActionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete this note?"
        description={
          <>
            This cannot be undone.
            <span className="mt-2 block font-medium text-white/90">
              {deletePreviewTitle}
            </span>
          </>
        }
        icon={<Trash2 className="h-5 w-5" strokeWidth={1.75} />}
        actions={[
          {
            label: "Cancel",
            variant: "default",
            onClick: () => setDeleteModalOpen(false),
          },
          {
            label: "Delete",
            variant: "danger",
            onClick: async () => {
              await handleDelete();
              setDeleteModalOpen(false);
            },
          },
        ]}
      />

      <ActionModal
        open={unsavedModalOpen}
        onOpenChange={(open) => {
          if (!open) cancelUnsavedNav();
        }}
        title="Unsaved changes"
        description="Save your edits before switching notes?"
        icon={<AlertTriangle className="h-5 w-5 text-amber-200/90" strokeWidth={1.75} />}
        actions={[
          {
            label: "Stay",
            variant: "default",
            onClick: cancelUnsavedNav,
          },
          {
            label: "Discard",
            variant: "danger",
            onClick: confirmUnsavedDiscard,
          },
          {
            label: "Save",
            variant: "primary",
            onClick: confirmUnsavedSave,
          },
        ]}
      />

      <ActionModal
        open={!!saveError}
        onOpenChange={(open) => {
          if (!open) setSaveError(null);
        }}
        title="Cannot save note yet"
        description={saveError ?? ""}
        icon={<AlertTriangle className="h-5 w-5 text-amber-200/90" strokeWidth={1.75} />}
        actions={[
          {
            label: "OK",
            variant: "primary",
            onClick: () => setSaveError(null),
          },
        ]}
      />
    </>
  );
}
