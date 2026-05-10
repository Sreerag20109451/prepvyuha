import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";

const engineCards = [
  {
    title: "The Interlink Note Editor",
    description:
      "Medium-style distraction-free writing with bi-directional linking — build a living web of concepts that scales from NCERT to opinion.",
    accent: "from-violet-500/25 to-transparent",
  },
  {
    title: "Automated Syllabus Tracker",
    description:
      "A micro-topic heatmap that tracks your progress from NCERTs to Mains — see cold spots before they become exam-day shocks.",
    accent: "from-fuchsia-500/25 to-transparent",
    heatmap: true,
  },
  {
    title: "Spaced Repetition Alerts",
    description:
      "Intelligent revision triggers aligned with the forgetting curve — so retention compounds instead of leaking between tests.",
    accent: "from-purple-500/25 to-transparent",
  },
  {
    title: "AI Mains Evaluator",
    description:
      "Instant structural feedback on your answer writing with PYQ integration — dimension-wise cues where arguments need steel.",
    accent: "from-indigo-500/25 to-transparent",
  },
  {
    title: "Dynamic Timelines",
    description:
      "Auto-generated historical and event timelines from your text notes — context that stays synced as your library grows.",
    accent: "from-violet-600/25 to-transparent",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-white">
          Prep<span className="text-[#C8A2C8]">Vyuha</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-[#A0AEC0] md:flex">
          <a href="#engine" className="transition-colors hover:text-white">
            Core engine
          </a>
          <a href="#the-pulse" className="transition-colors hover:text-white">
            The Pulse
          </a>
          <a href="#aspirants-mirror" className="transition-colors hover:text-white">
            Analytics
          </a>
        </div>
        <Link
          href="/dashboard"
          className="rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-xl transition-colors hover:border-purple-400/35"
        >
          Workspace
        </Link>
      </nav>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-6 pb-24 pt-8 md:gap-28 md:pt-12">
        {/* Hero */}
        <section className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A0AEC0]">
              UPSC 2027 · Strategic preparation
            </p>
            <h1 className="font-serif text-4xl font-bold leading-[1.12] tracking-tight text-white md:text-5xl lg:text-[3.25rem]">
              Master the UPSC Syllabus with{" "}
              <GradientText
                as="span"
                className="font-serif font-bold"
              >
                Strategic Precision.
              </GradientText>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#A0AEC0]">
              The all-in-one &apos;War Room&apos; for UPSC 2027. Connect your notes,
              automate your revision, and bridge the gap between static topics and
              current affairs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] px-8 py-3.5 text-sm font-semibold text-[#0a0a1b] shadow-[0_0_30px_rgba(167,139,250,0.35)] transition-opacity hover:opacity-95"
              >
                Start Your Vyuha
              </Link>
              <a
                href="#the-pulse"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-8 py-3.5 text-sm font-medium text-white hover:border-purple-400/30"
              >
                Watch Demo
              </a>
            </div>
          </div>

          <GlassCard glow="purple" className="relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-semibold text-white">
                  Command preview
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  2027 cohort
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#A0AEC0]">
                Your syllabus, revision rhythm, and CA map converge in one glass
                surface — built for depth without clutter.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs text-[#A0AEC0]">Syllabus covered</p>
                  <p className="mt-2 font-serif text-3xl font-bold tabular-nums text-white">
                    64%
                  </p>
                  <p className="mt-1 text-xs text-emerald-300/90">Heatmap on track</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs text-[#A0AEC0]">Revision queue</p>
                  <p className="mt-2 font-serif text-3xl font-bold tabular-nums text-white">
                    3
                  </p>
                  <p className="mt-1 text-xs text-amber-200/90">Due this week</p>
                </div>
              </div>
              <div className="h-28 rounded-xl border border-white/10 bg-gradient-to-t from-black/40 to-white/[0.03] p-4">
                <div className="flex h-full items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-md bg-gradient-to-t from-purple-600/60 to-purple-400/30"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Core Engine */}
        <section id="engine" className="scroll-mt-24 space-y-10">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              The{" "}
              <GradientText as="span" className="font-serif font-bold">
                Core Engine
              </GradientText>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#A0AEC0]">
              Five systems designed to move you from passive reading to decisive
              recall and mains-ready articulation.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {engineCards.map((card) => (
              <GlassCard
                key={card.title}
                className="relative overflow-hidden p-6 transition-colors hover:border-white/15"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${card.accent} to-transparent opacity-90`}
                />
                <div className="relative">
                  <h3 className="font-serif text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A0AEC0]">
                    {card.description}
                  </p>
                  {"heatmap" in card && card.heatmap && (
                    <div className="mt-5 grid grid-cols-8 gap-1.5 rounded-lg border border-white/10 bg-black/40 p-3">
                      {Array.from({ length: 24 }).map((_, i) => {
                        const intensity = [0.15, 0.35, 0.55, 0.75, 0.45, 0.25][
                          i % 6
                        ];
                        return (
                          <div
                            key={i}
                            className="aspect-square rounded-sm bg-purple-400"
                            style={{ opacity: 0.25 + intensity * 0.65 }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* The Pulse — Current Affairs */}
        <section
          id="the-pulse"
          className="scroll-mt-24 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A0AEC0]">
              Current affairs
            </p>
            <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Don&apos;t just read news.{" "}
              <GradientText as="span" className="font-serif font-bold">
                Map it.
              </GradientText>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#A0AEC0]">
              Every headline becomes an actionable node: tag it to GS Paper II or
              Paper III themes and it lands in your library beside static concepts
              — so policy, governance, and economy stay stitched together.
            </p>
          </div>

          <GlassCard glow="purple" className="relative overflow-hidden p-6 md:p-8">
            <div className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-600/15 blur-3xl" />
            <div className="relative space-y-6">
              <div className="rounded-xl border border-white/15 bg-black/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0]">
                  Today&apos;s lead
                </p>
                <p className="mt-2 font-serif text-lg leading-snug text-white">
                  RBI revises inflation projection; monetary stance unchanged as
                  liquidity tools widen.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[#A0AEC0]">
                    Economy
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[#A0AEC0]">
                    Governance
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0AEC0]">
                    Tag to syllabus
                  </span>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent sm:hidden" />
                </div>
                <div className="flex flex-1 flex-wrap justify-center gap-3 sm:justify-end">
                  <span className="rounded-xl border border-purple-400/35 bg-purple-500/15 px-4 py-2 text-center font-serif text-sm font-semibold text-[#E9D8FD] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    GS Paper II
                    <span className="mt-0.5 block text-[10px] font-sans font-normal text-[#A0AEC0]">
                      Polity · Institutions
                    </span>
                  </span>
                  <span className="rounded-xl border border-violet-400/35 bg-violet-500/15 px-4 py-2 text-center font-serif text-sm font-semibold text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                    GS Paper III
                    <span className="mt-0.5 block text-[10px] font-sans font-normal text-[#A0AEC0]">
                      Economy · Banking
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-center text-xs text-[#A0AEC0]">
                In-app: one click attaches the clip to your note graph and revision
                stack.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* The Aspirant's Mirror */}
        <section id="aspirants-mirror" className="scroll-mt-24 space-y-8">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Strategic analytics ·{" "}
              <GradientText as="span" className="font-serif font-bold">
                The Aspirant&apos;s Mirror
              </GradientText>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#A0AEC0]">
              A single pane that reflects balance — not vanity metrics — so you
              adjust before the calendar adjusts you.
            </p>
          </div>

          <GlassCard className="mx-auto max-w-3xl p-8">
            <div className="mb-8 flex flex-col gap-2 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-serif text-xl font-semibold text-white">
                  Session snapshot
                </p>
                <p className="text-sm text-[#A0AEC0]">
                  Illustrative dashboard values — live data in your workspace.
                </p>
              </div>
              <span className="w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[#A0AEC0]">
                Mock UI
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
                  Syllabus covered
                </p>
                <p className="mt-3 font-serif text-4xl font-bold tabular-nums text-white">
                  64%
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-[#D6BCFA]"
                    style={{ width: "64%" }}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
                  Revision overdue
                </p>
                <p className="mt-3 font-serif text-4xl font-bold tabular-nums text-amber-200">
                  3 topics
                </p>
                <p className="mt-2 text-sm text-[#A0AEC0]">
                  Surfaced by spaced repetition
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[#A0AEC0]">
                  Mains vs Prelims balance
                </p>
                <p className="mt-3 font-serif text-4xl font-bold tabular-nums text-white">
                  40<span className="text-[#A0AEC0]">/</span>
                  <span className="text-[#D6BCFA]">60</span>
                </p>
                <p className="mt-2 text-sm text-[#A0AEC0]">
                  Mains-oriented · Prelims-oriented weighting
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Anchor targets for footer */}
        <section id="pricing" className="scroll-mt-24">
          <GlassCard className="p-6 text-center md:p-8">
            <h3 className="font-serif text-xl font-semibold text-white">
              Pricing
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#A0AEC0]">
              Plans for the 2027 cycle will align with serious daily use — unlock
              the full War Room inside your workspace when billing goes live.
            </p>
          </GlassCard>
        </section>

        <section id="roadmap" className="scroll-mt-24">
          <GlassCard className="p-6 text-center md:p-8">
            <h3 className="font-serif text-xl font-semibold text-white">
              2027 roadmap
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#A0AEC0]">
              AI mains evaluator refinements, deeper PYQ vault coverage, and tighter
              CA-to-syllabus graphing — shipped as milestones, not noise.
            </p>
          </GlassCard>
        </section>

        <footer className="border-t border-white/10 pt-12 pb-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
            <div className="text-center md:text-left">
              <p className="font-serif text-lg font-semibold text-white">
                Prep<span className="text-[#C8A2C8]">Vyuha</span>
              </p>
              <p className="mt-1 max-w-xs text-sm text-[#A0AEC0]">
                Serif conviction. Sans clarity. One preparation surface.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-[#A0AEC0]">
              <Link href="/syllabus" className="transition-colors hover:text-white">
                Syllabus
              </Link>
              <Link href="/practice" className="transition-colors hover:text-white">
                PYQ Vault
              </Link>
              <a href="#pricing" className="transition-colors hover:text-white">
                Pricing
              </a>
              <a href="#roadmap" className="transition-colors hover:text-white">
                2027 Roadmap
              </a>
            </nav>
          </div>
          <p className="mt-10 text-center text-xs text-[#A0AEC0]/80">
            PrepVyuha · Built for the 2027 cohort · Firebase-ready workspace
          </p>
        </footer>
      </main>
    </div>
  );
}
