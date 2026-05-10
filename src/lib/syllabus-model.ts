import type { SyllabusModel, SyllabusSubject } from "@/types/prep";

export function subjectsFromSyllabusModel(model: SyllabusModel): SyllabusSubject[] {
  return model.papers
    .filter((paper) => paper.kind !== "ncert")
    .map((paper) => ({
      id: paper.id,
      label: paper.label,
      topics: paper.subjects.flatMap((subject) =>
        subject.specificSubjects.map((specific) => ({
          id: specific.id,
          label: `${subject.label} - ${specific.label}`,
          subtopics: specific.areas.flatMap((area) =>
            area.topics.map((topic) => ({
              id: topic.id,
              label: `${area.label}: ${topic.label}`,
            })),
          ),
        })),
      ),
    }));
}

export function buildSyllabusModelFromSubjects(
  subjects: SyllabusSubject[],
  now = Date.now(),
): SyllabusModel {
  let subjectCount = 0;
  let topicCount = 0;
  let subtopicCount = 0;
  const syllabusId = "upsc-cse-complete";

  const papers = subjects.map((paper, paperIndex) => ({
    id: paper.id,
    syllabusId,
    label: paper.label,
    stage: paper.id.startsWith("prelims")
      ? ("prelims" as const)
      : paper.id.startsWith("interview")
        ? ("interview" as const)
        : ("mains" as const),
    kind: paper.id.includes("csat")
      ? ("csat" as const)
      : paper.id.includes("essay")
        ? ("essay" as const)
        : paper.id.includes("optional")
          ? ("optional" as const)
          : paper.id.includes("language")
            ? ("language" as const)
            : paper.id.includes("interview")
              ? ("personality" as const)
              : ("gs" as const),
    description: "",
    order: paperIndex,
    subjects: paper.topics.map((specific, specificIndex) => {
      subjectCount += 1;
      topicCount += specific.subtopics.length;
      subtopicCount += specific.subtopics.length;
      return {
        id: specific.id,
        syllabusId,
        paperId: paper.id,
        label: specific.label,
        description: "",
        order: specificIndex,
        specificSubjects: [
          {
            id: `${specific.id}-core`,
            syllabusId,
            paperId: paper.id,
            subjectId: specific.id,
            label: "Core areas",
            description: "",
            order: 0,
            areas: [
              {
                id: `${specific.id}-decoded`,
                syllabusId,
                paperId: paper.id,
                subjectId: specific.id,
                specificSubjectId: `${specific.id}-core`,
                label: "Decoded syllabus",
                description: "",
                order: 0,
                topics: specific.subtopics.map((subtopic, topicIndex) => ({
                  id: subtopic.id,
                  syllabusId,
                  paperId: paper.id,
                  subjectId: specific.id,
                  specificSubjectId: `${specific.id}-core`,
                  areaId: `${specific.id}-decoded`,
                  label: subtopic.label,
                  description: "",
                  order: topicIndex,
                })),
              },
            ],
          },
        ],
      };
    }),
  }));

  return {
    id: syllabusId,
    title: "Complete UPSC CSE Syllabus",
    exam: "UPSC CSE",
    cycle: "2027",
    version: 4,
    sources: [
      "IAS Parliament UPSC Decoding Syllabus PDF",
      "Vajiram & Ravi NCERT books for UPSC",
      "Vajiram & Ravi UPSC syllabus",
    ],
    paperCount: papers.length,
    subjectCount,
    topicCount,
    subtopicCount,
    papers,
    createdAt: now,
    updatedAt: now,
  };
}
