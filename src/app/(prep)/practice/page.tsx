"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useNotes } from "@/hooks/use-notes";
import { useSyllabusTree } from "@/hooks/use-syllabus";
import type { MCQQuestion, PYQ } from "@/lib/domain/types";

type QuizPhase = "idle" | "running" | "done";

type EvalResult = {
  keywordCoveragePct: number;
  hasIntro: boolean;
  hasBodyBullets: boolean;
  hasConclusion: boolean;
  score: number;
  feedback: string[];
};

type AgentPyq = {
  year: number;
  paper: string;
  type: "Prelims" | "Mains";
  question: string;
  source?: string;
};

type AgentMainsResult = {
  score: number;
  strengths: string[];
  gaps: string[];
  improvedStructure: string[];
  pyqRelevance: string;
};

type PracticeTab = "quiz" | "mains";

export default function PracticePage() {
  const [tab, setTab] = useState<PracticeTab>("quiz");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          <GradientText as="span" className="font-bold">
            Practice
          </GradientText>
        </h1>
        <p className="mt-2 text-sm text-[#A0AEC0]">
          Quiz generator and mains structure check in one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("quiz")}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            tab === "quiz"
              ? "border-purple-400/50 bg-purple-500/20 text-[#E9D8FD]"
              : "border-white/15 text-[#A0AEC0] hover:bg-white/5 hover:text-white"
          }`}
        >
          Quiz & PYQ
        </button>
        <button
          type="button"
          onClick={() => setTab("mains")}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            tab === "mains"
              ? "border-purple-400/50 bg-purple-500/20 text-[#E9D8FD]"
              : "border-white/15 text-[#A0AEC0] hover:bg-white/5 hover:text-white"
          }`}
        >
          Mains evaluator
        </button>
      </div>

      {tab === "quiz" ? <QuizPanel /> : <MainsPanel />}
    </div>
  );
}

function QuizPanel() {
  const { notes } = useNotes();
  const { syllabus } = useSyllabusTree();
  const [phase, setPhase] = useState<QuizPhase>("idle");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [agentPyqs, setAgentPyqs] = useState<AgentPyq[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [topicId, setTopicId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [agentBusy, setAgentBusy] = useState(false);

  const current = questions[index];
  const areas = syllabus.papers.flatMap((paper) =>
    paper.subjects.flatMap((subject) =>
      subject.specificSubjects.flatMap((specific) =>
        specific.areas.map((area) => ({
          ...area,
          label: `${subject.label} - ${specific.label} - ${area.label}`,
        })),
      ),
    ),
  );
  const topics = areas.find((area) => area.id === areaId)?.topics ?? [];
  const selectedTopic = topics.find((t) => t.id === topicId);
  const selectedNotes = notes.filter((n) =>
    (n.syllabusLinks ?? []).some((l) => l.subtopicId === topicId),
  );
  const progressLabel = useMemo(
    () =>
      questions.length ? `${index + 1} / ${questions.length}` : "0 / 0",
    [index, questions.length],
  );

  async function start() {
    if (!topicId) return;
    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topicId, notes }),
    });
    if (!res.ok) return;
    const payload = (await res.json()) as { mcqs: MCQQuestion[]; pyqs: PYQ[] };
    setQuestions(payload.mcqs);
    setPyqs(payload.pyqs);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setPhase("running");
  }

  async function fetchPyqs() {
    if (!topicId || !selectedTopic) return;
    setAgentBusy(true);
    try {
      const res = await fetch("/api/agents/pyq", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topicId,
          topicLabel: selectedTopic.label,
          notes: selectedNotes,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { pyqs: AgentPyq[] };
        setAgentPyqs(data.pyqs ?? []);
      }
    } finally {
      setAgentBusy(false);
    }
  }

  function choose(optionIdx: number) {
    if (phase !== "running" || selected !== null || !current) return;
    setSelected(optionIdx);
    if (optionIdx === current.answerIndex) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  return (
    <>
      <GlassCard className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
          Session setup
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-[#A0AEC0]">
            Area
            <select
              value={areaId}
              onChange={(e) => {
                setAreaId(e.target.value);
                setTopicId("");
              }}
              className="ml-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value="">Select area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[#A0AEC0]">
            Topic
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="ml-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value="">Select topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <span className="text-xs text-[#A0AEC0]">
            Uses {selectedNotes.length} linked notes automatically
          </span>
          {phase === "idle" && (
            <button
              type="button"
              onClick={() => void start()}
              className="rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] px-6 py-2.5 text-sm font-semibold text-[#0a0a1b]"
            >
              Generate
            </button>
          )}
          <button
            type="button"
            onClick={() => void fetchPyqs()}
            disabled={!topicId || agentBusy}
            className="rounded-xl border border-purple-400/35 bg-purple-500/15 px-5 py-2.5 text-sm font-semibold text-[#E9D8FD] disabled:opacity-50"
          >
            {agentBusy ? "Finding PYQs..." : "Find real PYQs"}
          </button>
        </div>
      </GlassCard>

      {agentPyqs.length > 0 && (
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-white">
            Previous year questions
          </p>
          <div className="mt-3 space-y-3">
            {agentPyqs.map((p, i) => (
              <div key={`${p.year}-${i}`} className="rounded-xl border border-white/10 bg-black/25 p-3">
                <p className="text-xs text-[#A0AEC0]">
                  {p.year} · {p.paper} · {p.type}
                </p>
                <p className="mt-1 text-sm text-white/90">{p.question}</p>
                {p.source ? (
                  <p className="mt-1 truncate text-xs text-[#A0AEC0]">
                    {p.source}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {phase === "running" && current && (
        <GlassCard glow="purple" className="p-8">
          <div className="flex items-center justify-between text-sm text-[#A0AEC0]">
            <span>Topic session</span>
            <span>{progressLabel}</span>
          </div>
          <p className="mt-6 text-lg font-medium leading-relaxed text-white">
            {current.stem}
          </p>
          <ul className="mt-8 space-y-3">
            {current.options.map((opt: string, i: number) => {
              const reveal = selected !== null;
              const correct = i === current.answerIndex;
              const wrongPick = reveal && selected === i && !correct;
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={selected !== null}
                    onClick={() => choose(i)}
                    className={`flex w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      reveal && correct
                        ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100"
                        : wrongPick
                          ? "border-red-400/40 bg-red-500/10 text-red-100"
                          : "border-white/10 bg-black/30 text-white hover:border-purple-500/40"
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
          {selected !== null && (
            <button
              type="button"
              onClick={next}
              className="mt-8 w-full rounded-xl border border-white/15 py-3 text-sm font-medium text-white hover:bg-white/5"
            >
              {index + 1 >= questions.length ? "See results" : "Next"}
            </button>
          )}
        </GlassCard>
      )}

      {phase === "done" && (
        <GlassCard className="space-y-4 p-8 text-center">
          <p className="text-sm text-[#A0AEC0]">Session complete</p>
          <p className="mt-4 text-4xl font-bold text-white">
            {score} / {questions.length}
          </p>
          <p className="mt-2 text-sm text-[#A0AEC0]">Correct answers</p>
          <div className="mx-auto mt-4 max-w-xl space-y-2 text-left">
            <p className="text-sm font-medium text-white">Relevant PYQs</p>
            {pyqs.length === 0 ? (
              <p className="text-xs text-[#A0AEC0]">
                No PYQs in mock DB for this topic.
              </p>
            ) : (
              pyqs.map((p) => (
                <p key={p.id} className="text-xs text-[#A0AEC0]">
                  {p.year} ({p.type}) - {p.question}
                </p>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase("idle");
              setQuestions([]);
            }}
            className="mt-8 rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] px-8 py-3 text-sm font-semibold text-[#0a0a1b]"
          >
            New session
          </button>
        </GlassCard>
      )}
    </>
  );
}

function MainsPanel() {
  const { notes } = useNotes();
  const { syllabus } = useSyllabusTree();
  const [keywords, setKeywords] = useState(
    "federalism, devolution, governance",
  );
  const areas = syllabus.papers.flatMap((paper) =>
    paper.subjects.flatMap((subject) =>
      subject.specificSubjects.flatMap((specific) =>
        specific.areas.map((area) => ({
          ...area,
          label: `${subject.label} - ${specific.label} - ${area.label}`,
        })),
      ),
    ),
  );
  const [areaId, setAreaId] = useState("");
  const topics = areas.find((area) => area.id === areaId)?.topics ?? [];
  const [topicId, setTopicId] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [result, setResult] = useState<EvalResult | null>(null);
  const [agentResult, setAgentResult] = useState<AgentMainsResult | null>(null);
  const [agentBusy, setAgentBusy] = useState(false);
  const selectedTopic = topics.find((t) => t.id === topicId);
  const selectedNotes = notes.filter((n) => selectedNoteIds.includes(n.id));

  async function evaluate() {
    const res = await fetch("/api/evaluator/mains", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        answerText,
        keywords: keywords
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      }),
    });
    if (!res.ok) return;
    setResult((await res.json()) as EvalResult);
  }

  async function evaluateWithAgent() {
    if (!selectedTopic || !question || !answerText) return;
    setAgentBusy(true);
    try {
      const res = await fetch("/api/agents/mains", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topicLabel: selectedTopic.label,
          question,
          answerText,
          notes: selectedNotes,
        }),
      });
      if (res.ok) setAgentResult((await res.json()) as AgentMainsResult);
    } finally {
      setAgentBusy(false);
    }
  }

  return (
    <>
      <GlassCard className="space-y-4 p-6">
        <select
          value={areaId}
          onChange={(e) => {
            setAreaId(e.target.value);
            setTopicId("");
          }}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
        >
          <option value="">Select area</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.label}
            </option>
          ))}
        </select>
        <select
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
        >
          <option value="">Select topic</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          multiple
          value={selectedNoteIds}
          onChange={(e) =>
            setSelectedNoteIds(
              Array.from(e.target.selectedOptions).map((o) => o.value),
            )
          }
          className="min-h-28 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
        >
          {notes.map((note) => (
            <option key={note.id} value={note.id}>
              {note.title}
            </option>
          ))}
        </select>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
          placeholder="Paste/select the PYQ or mains question"
        />
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
          placeholder="Keyword list (comma separated)"
        />
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={10}
          className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
          placeholder="Paste/write your mains answer"
        />
        <button
          type="button"
          onClick={() => void evaluate()}
          className="rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] px-5 py-2.5 text-sm font-semibold text-[#0a0a1b]"
        >
          Evaluate structure
        </button>
        <button
          type="button"
          onClick={() => void evaluateWithAgent()}
          disabled={!topicId || !question || !answerText || agentBusy}
          className="ml-2 rounded-xl border border-purple-400/35 bg-purple-500/15 px-5 py-2.5 text-sm font-semibold text-[#E9D8FD] disabled:opacity-50"
        >
          {agentBusy ? "Evaluating..." : "AI evaluate with notes/topic"}
        </button>
      </GlassCard>
      {agentResult ? (
        <GlassCard className="p-6">
          <p className="text-3xl font-bold text-white">{agentResult.score}/100</p>
          <p className="mt-2 text-sm text-[#A0AEC0]">
            {agentResult.pyqRelevance}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-white">Strengths</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#A0AEC0]">
                {agentResult.strengths.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Gaps</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#A0AEC0]">
                {agentResult.gaps.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-white">Better structure</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#A0AEC0]">
            {agentResult.improvedStructure.map((x) => <li key={x}>{x}</li>)}
          </ol>
        </GlassCard>
      ) : null}
      {result ? (
        <GlassCard className="p-6">
          <p className="text-3xl font-bold text-white">{result.score}/100</p>
          <p className="mt-1 text-sm text-[#A0AEC0]">
            Keyword coverage: {result.keywordCoveragePct}%
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-6 text-sm text-[#A0AEC0]">
            {result.feedback.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </GlassCard>
      ) : null}
    </>
  );
}
