import { z } from "zod";

export const paperSchema = z.enum(["GS1", "GS2", "GS3", "GS4", "Optional"]);
export type Paper = z.infer<typeof paperSchema>;

export const subtopicStatusSchema = z.enum([
  "Unread",
  "InProgress",
  "Mastered",
]);
export type SubtopicStatus = z.infer<typeof subtopicStatusSchema>;

export const subjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  paper: paperSchema,
  order: z.number().int().nonnegative().default(0),
});
export type SubjectNode = z.infer<typeof subjectSchema>;

export const topicSchema = z.object({
  id: z.string().min(1),
  subjectId: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().nonnegative().default(0),
});
export type TopicNode = z.infer<typeof topicSchema>;

export const subtopicSchema = z.object({
  id: z.string().min(1),
  topicId: z.string().min(1),
  name: z.string().min(1),
  status: subtopicStatusSchema.default("Unread"),
  confidenceScore: z.number().min(1).max(5).default(3),
  revisionInterval: z.number().nonnegative().default(0),
  lastRevisedAt: z.number().nullable().default(null),
  revisionDueAt: z.number().nullable().default(null),
});
export type SubtopicNode = z.infer<typeof subtopicSchema>;

export const pyqSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  paper: paperSchema,
  topicId: z.string(),
  type: z.enum(["Prelims", "Mains"]),
  question: z.string(),
});
export type PYQ = z.infer<typeof pyqSchema>;

export const mcqSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  stem: z.string(),
  options: z.array(z.string()).length(4),
  answerIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
  sourceNoteId: z.string().nullable(),
});
export type MCQQuestion = z.infer<typeof mcqSchema>;

export const revisionInputSchema = z.object({
  intervalDays: z.number().nonnegative().default(0),
  easeFactor: z.number().min(1.3).default(2.5),
  confidenceScore: z.number().int().min(1).max(5),
  reviewedAt: z.number().int().default(() => Date.now()),
});
export type RevisionInput = z.infer<typeof revisionInputSchema>;

export const milestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.number(),
  type: z.enum(["Exam", "Mock", "Plan"]),
});
export type Milestone = z.infer<typeof milestoneSchema>;

export const currentAffairInputSchema = z.object({
  sourceUrl: z.string().url().optional(),
  rawText: z.string().min(20),
});
export type CurrentAffairInput = z.infer<typeof currentAffairInputSchema>;
