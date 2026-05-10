import type { SyllabusSubject } from "@/types/prep";

/** NCERT tracking tree built from UPSC-focused NCERT book lists. */
export const DEFAULT_NCERT_SUBJECTS: SyllabusSubject[] = [
  {
    id: "ncert",
    label: "NCERT Books for UPSC",
    topics: [
      {
        id: "ncert-c6",
        label: "Class 6",
        subtopics: [
          { id: "ncert-c6-history-our-pasts-1", label: "History - Our Pasts I" },
          { id: "ncert-c6-geography-earth-habitat", label: "Geography - The Earth Our Habitat" },
          { id: "ncert-c6-polity-social-political-life-1", label: "Social & Political Life I" },
          { id: "ncert-c6-science", label: "Science - Class VI" },
        ],
      },
      {
        id: "ncert-c7",
        label: "Class 7",
        subtopics: [
          { id: "ncert-c7-history-our-pasts-2", label: "History - Our Pasts II" },
          { id: "ncert-c7-geography-environment", label: "Geography - Our Environment" },
          { id: "ncert-c7-polity-social-political-life-2", label: "Social & Political Life II" },
          { id: "ncert-c7-science", label: "Science - Class VII" },
        ],
      },
      {
        id: "ncert-c8",
        label: "Class 8",
        subtopics: [
          { id: "ncert-c8-history-our-pasts-3", label: "History - Our Pasts III" },
          { id: "ncert-c8-geography-resource-development", label: "Geography - Resource and Development" },
          { id: "ncert-c8-polity-social-political-life-3", label: "Social & Political Life III" },
          { id: "ncert-c8-science", label: "Science - Class VIII" },
        ],
      },
      {
        id: "ncert-c9",
        label: "Class 9",
        subtopics: [
          { id: "ncert-c9-history-india-contemporary-1", label: "History - India and the Contemporary World I" },
          { id: "ncert-c9-geography-contemporary-india-1", label: "Geography - Contemporary India I" },
          { id: "ncert-c9-polity-democratic-politics-1", label: "Polity - Democratic Politics I" },
          { id: "ncert-c9-economics", label: "Economics - Class IX" },
          { id: "ncert-c9-science", label: "Science - Class IX" },
        ],
      },
      {
        id: "ncert-c10",
        label: "Class 10",
        subtopics: [
          { id: "ncert-c10-history-india-contemporary-2", label: "History - India and the Contemporary World II" },
          { id: "ncert-c10-geography-contemporary-india-2", label: "Geography - Contemporary India II" },
          { id: "ncert-c10-polity-democratic-politics-2", label: "Polity - Democratic Politics II" },
          { id: "ncert-c10-economics-development", label: "Economics - Understanding Economic Development" },
          { id: "ncert-c10-science", label: "Science - Class X" },
        ],
      },
      {
        id: "ncert-c11",
        label: "Class 11",
        subtopics: [
          { id: "ncert-c11-history-world-history", label: "History - Themes in World History" },
          { id: "ncert-c11-geography-physical", label: "Geography - Fundamentals of Physical Geography" },
          { id: "ncert-c11-geography-india-physical", label: "Geography - India Physical Environment" },
          { id: "ncert-c11-polity-constitution", label: "Polity - Indian Constitution at Work" },
          { id: "ncert-c11-polity-theory", label: "Polity - Political Theory" },
          { id: "ncert-c11-sociology-understanding-society", label: "Sociology - Understanding Society" },
          { id: "ncert-c11-economics-indian-development", label: "Economics - Indian Economic Development" },
          { id: "ncert-c11-art-introduction", label: "Art & Culture - An Introduction to Indian Art" },
          { id: "ncert-c11-psychology", label: "Psychology - Class XI" },
        ],
      },
      {
        id: "ncert-c12",
        label: "Class 12",
        subtopics: [
          { id: "ncert-c12-history-indian-history-1", label: "History - Themes in Indian History I" },
          { id: "ncert-c12-history-indian-history-2", label: "History - Themes in Indian History II" },
          { id: "ncert-c12-history-indian-history-3", label: "History - Themes in Indian History III" },
          { id: "ncert-c12-geography-human", label: "Geography - Fundamentals of Human Geography" },
          { id: "ncert-c12-geography-india-people-economy", label: "Geography - India: People and Economy" },
          { id: "ncert-c12-polity-world-politics", label: "Polity - Contemporary World Politics" },
          { id: "ncert-c12-polity-india-since-independence", label: "Polity - Politics in India Since Independence" },
          { id: "ncert-c12-sociology-indian-society", label: "Sociology - Indian Society" },
          { id: "ncert-c12-sociology-social-change", label: "Sociology - Social Change and Development in India" },
          { id: "ncert-c12-economics-micro", label: "Economics - Introductory Microeconomics" },
          { id: "ncert-c12-economics-macro", label: "Economics - Introductory Macroeconomics" },
          { id: "ncert-c12-art-craft-traditions", label: "Art & Culture - Living Craft Traditions of India" },
          { id: "ncert-c12-science-biology", label: "Science - Biology selected units" },
          { id: "ncert-c12-science-chemistry", label: "Science - Chemistry selected units" },
          { id: "ncert-c12-psychology", label: "Psychology - Class XII" },
        ],
      },
      {
        id: "ncert-old-history",
        label: "Old NCERT History",
        subtopics: [
          { id: "ncert-old-ancient-rs-sharma", label: "Ancient India - R.S. Sharma" },
          { id: "ncert-old-medieval-satish-chandra", label: "Medieval India - Satish Chandra" },
          { id: "ncert-old-modern-bipan-chandra", label: "Modern India - Bipan Chandra" },
          { id: "ncert-old-world-civilization", label: "The Story of Civilization - Arjun Dev" },
        ],
      },
    ],
  },
];

export const NCERT_STANDARD_OPTIONS = [
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "old-history",
] as const;

export type NcertStandardOption = (typeof NCERT_STANDARD_OPTIONS)[number];

export function topicIdForStandard(std: string): string {
  return std === "old-history" ? "ncert-old-history" : `ncert-c${std}`;
}

export function labelForStandard(std: string): string {
  return std === "old-history" ? "Old History" : `Class ${std}`;
}
