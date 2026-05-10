"use client";

import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";

export default function PomodoroPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center space-y-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          <GradientText as="span" className="font-bold">
            Pomodoro
          </GradientText>
        </h1>
        <p className="mt-2 text-sm text-[#A0AEC0]">
          Completed focus blocks are saved to your study calendar.
        </p>
      </div>

      <GlassCard glow="purple" className="w-full p-2">
        <PomodoroTimer title="Pomodoro focus" />
      </GlassCard>
    </div>
  );
}
