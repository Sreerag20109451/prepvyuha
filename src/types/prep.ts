import { z } from "zod";

export const syllabusSubtopicSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export type SyllabusSubtopic = {
  id: string;
  label: string;
};

export const syllabusTopicSchema = z.object({
  id: z.string(),
  label: z.string(),
  subtopics: z.array(syllabusSubtopicSchema),
});

export type SyllabusTopic = {
  id: string;
  label: string;
  subtopics: SyllabusSubtopic[];
};

export const syllabusSubjectSchema = z.object({
  id: z.string(),
  label: z.string(),
  topics: z.array(syllabusTopicSchema),
});

export type SyllabusSubject = {
  id: string;
  label: string;
  topics: SyllabusTopic[];
};

export const syllabusStageSchema = z.enum([
  "prelims",
  "mains",
  "interview",
  "ncert",
]);
export type SyllabusStage = z.infer<typeof syllabusStageSchema>;

export const syllabusPaperKindSchema = z.enum([
  "gs",
  "csat",
  "essay",
  "language",
  "optional",
  "personality",
  "ncert",
]);
export type SyllabusPaperKind = z.infer<typeof syllabusPaperKindSchema>;

export const syllabusSubtopicNodeSchema = z.object({
  id: z.string(),
  syllabusId: z.string(),
  paperId: z.string(),
  subjectId: z.string(),
  topicId: z.string(),
  label: z.string(),
  description: z.string().default(""),
  order: z.number().int().nonnegative().default(0),
  sourceRefs: z.array(z.string()).default([]),
});
export type SyllabusSubtopicNode = z.infer<typeof syllabusSubtopicNodeSchema>;

export const syllabusTopicNodeSchema = z.object({
  id: z.string(),
  syllabusId: z.string(),
  paperId: z.string(),
  subjectId: z.string(),
  specificSubjectId: z.string().default(""),
  areaId: z.string().default(""),
  label: z.string(),
  description: z.string().default(""),
  order: z.number().int().nonnegative().default(0),
});
export type SyllabusTopicNode = z.infer<typeof syllabusTopicNodeSchema>;

export const syllabusAreaNodeSchema = z.object({
  id: z.string(),
  syllabusId: z.string(),
  paperId: z.string(),
  subjectId: z.string(),
  specificSubjectId: z.string(),
  label: z.string(),
  description: z.string().default(""),
  order: z.number().int().nonnegative().default(0),
  topics: z.array(syllabusTopicNodeSchema).default([]),
});
export type SyllabusAreaNode = z.infer<typeof syllabusAreaNodeSchema>;

export const syllabusSpecificSubjectNodeSchema = z.object({
  id: z.string(),
  syllabusId: z.string(),
  paperId: z.string(),
  subjectId: z.string(),
  label: z.string(),
  description: z.string().default(""),
  order: z.number().int().nonnegative().default(0),
  areas: z.array(syllabusAreaNodeSchema).default([]),
});
export type SyllabusSpecificSubjectNode = z.infer<
  typeof syllabusSpecificSubjectNodeSchema
>;

export const syllabusSubjectNodeSchema = z.object({
  id: z.string(),
  syllabusId: z.string(),
  paperId: z.string(),
  label: z.string(),
  description: z.string().default(""),
  order: z.number().int().nonnegative().default(0),
  specificSubjects: z.array(syllabusSpecificSubjectNodeSchema).default([]),
});
export type SyllabusSubjectNode = z.infer<typeof syllabusSubjectNodeSchema>;

export const syllabusPaperNodeSchema = z.object({
  id: z.string(),
  syllabusId: z.string(),
  label: z.string(),
  stage: syllabusStageSchema,
  kind: syllabusPaperKindSchema,
  description: z.string().default(""),
  order: z.number().int().nonnegative().default(0),
  subjects: z.array(syllabusSubjectNodeSchema).default([]),
});
export type SyllabusPaperNode = z.infer<typeof syllabusPaperNodeSchema>;

export const syllabusModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  exam: z.literal("UPSC CSE"),
  cycle: z.string().default("2027"),
  version: z.number().int().positive(),
  sources: z.array(z.string()).default([]),
  paperCount: z.number().int().nonnegative().default(0),
  subjectCount: z.number().int().nonnegative().default(0),
  topicCount: z.number().int().nonnegative().default(0),
  subtopicCount: z.number().int().nonnegative().default(0),
  papers: z.array(syllabusPaperNodeSchema).default([]),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type SyllabusModel = z.infer<typeof syllabusModelSchema>;

/** @deprecated legacy flat checklist - migrated on load */
export type SyllabusItem = {
  id: string;
  label: string;
  done: boolean;
};

export const syllabusLinkSchema = z.object({
  subjectId: z.string(),
  topicId: z.string(),
  subtopicId: z.string(),
});

export type SyllabusLink = {
  subjectId: string;
  topicId: string;
  subtopicId: string;
};

export const noteKindSchema = z.enum([
  "daily_news",
  "current_affairs",
  "ncert",
  "gs_paper",
]);

/** Where the note was created from - drives syllabus tree (GS vs NCERT) and tagging UX. */
export type NoteKind =
  | "daily_news"
  | "current_affairs"
  | "ncert"
  | "gs_paper";

export const noteStudyStageSchema = z.enum(["first_read", "revision"]);
export type NoteStudyStage = z.infer<typeof noteStudyStageSchema>;

export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
  /** One note can map to multiple syllabus subtopics (counts once per subtopic). */
  syllabusLinks?: SyllabusLink[];
  /** Daily news / CA / GS use GS syllabus; NCERT uses NCERT tree. */
  noteKind?: NoteKind;
  /** When noteKind is NCERT - must match Class topic (e.g. "9" -> topic ncert-c9). */
  ncertStandard?: string;
  /** For NCERT notes, stores the selected NCERT subject/chapter bucket id. */
  ncertSubjectId?: string;
  /** For daily newspaper notes, stores the source date as YYYY-MM-DD. */
  dailyNewsDate?: string;
  /** For current affairs notes, stores the start date as YYYY-MM-DD. */
  currentAffairsStartDate?: string;
  /** For current affairs notes, stores the end date as YYYY-MM-DD. */
  currentAffairsEndDate?: string;
  /** For daily news/current affairs notes, stores current-events syllabus bucket. */
  currentEventsTopicId?: string;
  studyStage?: NoteStudyStage;
  revisionNumber?: number;
  completedSyllabusTopicIds?: string[];
  completedNcertBookIds?: string[];
  /** @deprecated use syllabusLinks - kept for migration */
  subjectId?: string | null;
  topicId?: string | null;
  subtopicId?: string | null;
};

export const revisionTopicSchema = z.object({
  id: z.string(),
  title: z.string(),
  lastReviewedAt: z.number().nullable(),
  intervalDays: z.number().nonnegative(),
  dueAt: z.number().nullable().optional(),
  noteId: z.string().nullable().optional(),
  source: z.enum(["manual", "note"]).default("manual").optional(),
  cadenceLabel: z.string().nullable().optional(),
});

export type RevisionTopic = {
  id: string;
  title: string;
  lastReviewedAt: number | null;
  intervalDays: number;
  dueAt?: number | null;
  noteId?: string | null;
  source?: "manual" | "note";
  cadenceLabel?: string | null;
};

export const studySessionKindSchema = z.enum([
  "note",
  "revision",
  "quiz",
  "pomodoro",
  "mains",
  "current_affairs",
]);
export type StudySessionKind = z.infer<typeof studySessionKindSchema>;

export type StudySession = {
  id: string;
  kind: StudySessionKind;
  title: string;
  startedAt: number;
  endedAt: number | null;
  durationMinutes: number;
  noteId?: string | null;
  topicId?: string | null;
  currentEventsTopicId?: string | null;
  syllabusLinks?: SyllabusLink[];
};

export type QuizQuestion = {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type SyllabusProgressMetrics = {
  totalSubtopics: number;
  firstReadCount: number;
  firstRevisionCount: number;
  firstReadPct: number;
  firstRevisionPct: number;
};

export type SubtopicProgressRow = {
  subtopicId: string;
  label: string;
  subjectLabel: string;
  topicLabel: string;
  noteCount: number;
  hasFirstRead: boolean;
  hasFirstRevision: boolean;
};
