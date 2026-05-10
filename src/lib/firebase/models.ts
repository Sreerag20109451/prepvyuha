import { z } from "zod";
import {
  noteKindSchema,
  noteStudyStageSchema,
  revisionTopicSchema,
  studySessionKindSchema,
  syllabusModelSchema,
  syllabusSubjectSchema,
} from "@/types/prep";

export const userProfileSchema = z.object({
  uid: z.string().min(1),
  displayName: z.string().default(""),
  email: z.string().email().or(z.literal("")).default(""),
  photoURL: z.string().url().or(z.literal("")).default(""),
  provider: z.literal("google").default("google"),
  examTarget: z.string().default("UPSC 2027"),
  createdAt: z.unknown().optional(),
  updatedAt: z.unknown().optional(),
});
export type UserProfileDoc = z.infer<typeof userProfileSchema>;

export const syllabusProgressSchema = z.object({
  version: z.number().int().positive().default(3),
  subjects: z.array(syllabusSubjectSchema).default([]),
  syllabus: syllabusModelSchema.optional(),
  updatedAt: z.number(),
});
export type SyllabusProgressDoc = z.infer<typeof syllabusProgressSchema>;

export const noteDocSchema = z.object({
  title: z.string(),
  body: z.string(),
  updatedAt: z.number(),
  syllabusLinks: z
    .array(
      z.object({
        subjectId: z.string(),
        topicId: z.string(),
        subtopicId: z.string(),
      }),
    )
    .default([]),
  noteKind: noteKindSchema.nullable().default(null),
  ncertStandard: z.string().nullable().default(null),
  ncertSubjectId: z.string().nullable().default(null),
  dailyNewsDate: z.string().nullable().default(null),
  currentAffairsStartDate: z.string().nullable().default(null),
  currentAffairsEndDate: z.string().nullable().default(null),
  currentEventsTopicId: z.string().nullable().default(null),
  studyStage: noteStudyStageSchema.default("first_read"),
  revisionNumber: z.number().int().positive().nullable().default(null),
  completedSyllabusTopicIds: z.array(z.string()).default([]),
  completedNcertBookIds: z.array(z.string()).default([]),
  subjectId: z.string().nullable().default(null),
  topicId: z.string().nullable().default(null),
  subtopicId: z.string().nullable().default(null),
});
export type NoteDoc = z.infer<typeof noteDocSchema>;

export const revisionProfileSchema = z.object({
  topics: z.array(revisionTopicSchema),
  updatedAt: z.number(),
});
export type RevisionProfileDoc = z.infer<typeof revisionProfileSchema>;

export const studySessionSchema = z.object({
  id: z.string(),
  kind: studySessionKindSchema,
  title: z.string().default("Study session"),
  startedAt: z.number(),
  endedAt: z.number().nullable().default(null),
  durationMinutes: z.number().nonnegative().default(0),
  noteId: z.string().nullable().default(null),
  topicId: z.string().nullable().default(null),
  currentEventsTopicId: z.string().nullable().default(null),
  syllabusLinks: noteDocSchema.shape.syllabusLinks.default([]),
});
export type StudySessionDoc = z.infer<typeof studySessionSchema>;

export const workspaceCollections = {
  user: (uid: string) => ["users", uid] as const,
  syllabus: (uid: string) => ["users", uid, "profile", "syllabus"] as const,
  syllabusPapers: (uid: string) => ["users", uid, "syllabusPapers"] as const,
  revision: (uid: string) => ["users", uid, "profile", "revision"] as const,
  notes: (uid: string) => ["users", uid, "notes"] as const,
  note: (uid: string, noteId: string) => ["users", uid, "notes", noteId] as const,
  sessions: (uid: string) => ["users", uid, "studySessions"] as const,
};
