import type { QuizQuestion } from "@/types/prep";

const pool: Omit<QuizQuestion, "id">[] = [
  {
    subject: "Polity",
    question:
      "Which Schedule of the Constitution deals with the allocation of seats in the Rajya Sabha?",
    options: ["Fourth Schedule", "Fifth Schedule", "Sixth Schedule", "Seventh Schedule"],
    correctIndex: 0,
  },
  {
    subject: "Polity",
    question:
      "Fundamental Duties were added to the Constitution by which amendment?",
    options: ["41st", "42nd", "43rd", "44th"],
    correctIndex: 1,
  },
  {
    subject: "History",
    question: "The Battle of Plassey was fought in which year?",
    options: ["1757", "1764", "1772", "1785"],
    correctIndex: 0,
  },
  {
    subject: "History",
    question:
      "Who among the following founded the Indian National Association in Calcutta?",
    options: [
      "Surendranath Banerjee",
      "Dadabhai Naoroji",
      "A.O. Hume",
      "Annie Besant",
    ],
    correctIndex: 0,
  },
  {
    subject: "Geography",
    question:
      "Which layer of the atmosphere contains the ozone layer?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    correctIndex: 1,
  },
  {
    subject: "Geography",
    question: "The Western Ghats are recognized as which UNESCO category in India?",
    options: [
      "World Heritage Site",
      "Biosphere Reserve only",
      "Geopark",
      "Ramsar site",
    ],
    correctIndex: 0,
  },
  {
    subject: "Economy",
    question:
      "GDP deflator measures prices of which of the following?",
    options: [
      "Only goods",
      "Only services",
      "All goods and services produced in the economy",
      "Consumer basket only",
    ],
    correctIndex: 2,
  },
  {
    subject: "Economy",
    question:
      "Open Market Operations are mainly conducted by which institution in India?",
    options: ["SEBI", "RBI", "NABARD", "Finance Ministry"],
    correctIndex: 1,
  },
  {
    subject: "Environment",
    question:
      "National Action Plan on Climate Change (NAPCC) was launched in which year?",
    options: ["2006", "2008", "2010", "2012"],
    correctIndex: 1,
  },
  {
    subject: "Science",
    question:
      "Photosynthesis primarily occurs in which part of the plant cell?",
    options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
    correctIndex: 1,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuizSession(
  count = 5,
  subject?: string | "all",
): QuizQuestion[] {
  let source = [...pool];
  if (subject && subject !== "all") {
    source = source.filter((p) => p.subject === subject);
  }
  if (source.length === 0) source = [...pool];
  const picked = shuffle(source).slice(0, Math.min(count, source.length));
  return picked.map((p, i) => {
    const correctText = p.options[p.correctIndex];
    const options = shuffle([...p.options]);
    const correctIndex = options.indexOf(correctText);
    return {
      id: `q_${i}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      subject: p.subject,
      question: p.question,
      options,
      correctIndex,
    };
  });
}

export const SUBJECTS = [
  ...new Set(pool.map((p) => p.subject)),
] as string[];
