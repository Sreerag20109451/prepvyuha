import type { Milestone } from "@/lib/domain/types";

export const UPSC_2027_MILESTONES: Milestone[] = [
  {
    id: "upsc-2027-prelims",
    title: "UPSC CSE Prelims 2027 (target)",
    date: new Date("2027-05-30").getTime(),
    type: "Exam",
  },
  {
    id: "upsc-2027-mains",
    title: "UPSC CSE Mains 2027 (target)",
    date: new Date("2027-09-15").getTime(),
    type: "Exam",
  },
  {
    id: "mock-q1-2027",
    title: "Q1 Full-Length Mock",
    date: new Date("2027-02-01").getTime(),
    type: "Mock",
  },
];
