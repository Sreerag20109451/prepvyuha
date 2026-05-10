"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { useRevision } from "@/hooks/use-revision";

export default function RevisionPage() {
  const { topics, dueToday, addTopic, markReviewed, removeTopic, ready } =
    useRevision();
  const [title, setTitle] = useState("");
  const [intervalDays, setIntervalDays] = useState(7);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          <GradientText as="span" className="font-bold">
            Revision helper
          </GradientText>
        </h1>
        <p className="mt-2 text-sm text-[#A0AEC0]">
          Track topics and surface what is due — lightweight spaced prompts for
          busy schedules.
        </p>
      </div>

      <GlassCard className="p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
          Add topic
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm text-[#A0AEC0]">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Indo-Greek kingdoms — consolidation"
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-white placeholder:text-white/25 focus:border-purple-500/40 focus:outline-none"
            />
          </label>
          <label className="text-sm text-[#A0AEC0]">
            Interval (days)
            <input
              type="number"
              min={1}
              max={90}
              value={intervalDays}
              onChange={(e) =>
                setIntervalDays(Number.parseInt(e.target.value, 10) || 7)
              }
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-white sm:w-28"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (!title.trim()) return;
              addTopic(title, intervalDays);
              setTitle("");
            }}
            className="rounded-xl bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] px-6 py-3 text-sm font-semibold text-[#0a0a1b]"
          >
            Add
          </button>
        </div>
      </GlassCard>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard glow="purple" className="p-6">
          <h2 className="text-lg font-semibold text-white">Due now</h2>
          {!ready ? (
            <p className="mt-4 text-sm text-[#A0AEC0]">Loading…</p>
          ) : dueToday.length === 0 ? (
            <p className="mt-4 text-sm text-[#A0AEC0]">
              Nothing due — add topics or mark reviews.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {dueToday.map((t) => (
                <li
                  key={t.id}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span>{t.title}</span>
                    <button
                      type="button"
                      onClick={() => markReviewed(t.id)}
                      className="shrink-0 rounded-lg border border-emerald-400/30 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/10"
                    >
                      Done
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-white">All topics</h2>
          {!ready ? (
            <p className="mt-4 text-sm text-[#A0AEC0]">Loading…</p>
          ) : topics.length === 0 ? (
            <p className="mt-4 text-sm text-[#A0AEC0]">
              Your revision stack will appear here.
            </p>
          ) : (
            <ul className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {topics.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm"
                >
                  <span className="truncate text-white/95">{t.title}</span>
                  <button
                    type="button"
                    onClick={() => removeTopic(t.id)}
                    className="shrink-0 text-xs text-red-300 hover:text-red-200"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
