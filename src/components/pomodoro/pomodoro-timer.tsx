"use client";

import { useEffect, useRef, useState } from "react";
import { useStudySessions } from "@/hooks/use-study-sessions";

const WORK = 25 * 60;
const SHORT = 5 * 60;
type Mode = "work" | "short";

export function PomodoroTimer({
  compact = false,
  noteId,
  title = "Pomodoro focus",
}: {
  compact?: boolean;
  noteId?: string | null;
  title?: string;
}) {
  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK);
  const [running, setRunning] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const { addSession } = useStudySessions();

  const total = mode === "work" ? WORK : SHORT;
  const pct = Math.round(((total - secondsLeft) / total) * 100);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    if (!startedAtRef.current) startedAtRef.current = Date.now();
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          const endedAt = Date.now();
          const startedAt = startedAtRef.current ?? endedAt - total * 1000;
          if (mode === "work") {
            void addSession({
              kind: "pomodoro",
              title,
              startedAt,
              endedAt,
              durationMinutes: Math.round((endedAt - startedAt) / 60000),
              noteId: noteId ?? null,
            });
          }
          startedAtRef.current = null;
          setRunning(false);
          return total;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [addSession, mode, noteId, running, title, total]);

  function reset(nextMode?: Mode) {
    setRunning(false);
    startedAtRef.current = null;
    const m = nextMode ?? mode;
    setMode(m);
    setSecondsLeft(m === "work" ? WORK : SHORT);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black/25 text-center ${
        compact ? "p-4" : "p-10"
      } ${running ? "shadow-[0_0_50px_rgba(168,85,247,0.25)]" : ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A0AEC0]">
        {mode === "work" ? "Focus" : "Short break"}
      </p>
      <p
        className={`mt-4 font-mono font-bold tabular-nums tracking-tight text-white ${
          compact ? "text-4xl" : "text-6xl md:text-7xl"
        }`}
      >
        {mm}:{ss}
      </p>
      <div className="mx-auto mt-5 h-2 max-w-xs overflow-hidden rounded-full bg-black/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-[#E9D8FD]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] px-5 py-2 text-sm font-semibold text-[#0a0a1b]"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => reset(mode === "work" ? "short" : "work")}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-[#A0AEC0] hover:bg-white/5 hover:text-white"
        >
          {mode === "work" ? "Break" : "Focus"}
        </button>
      </div>
    </div>
  );
}
