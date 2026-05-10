"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";

export function SignInPanel() {
  const { configured, error, loading, signInWithGoogle } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <GlassCard glow="purple" className="w-full max-w-md p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A0AEC0]">
          PrepVyuha
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white">
          Sign in to your{" "}
          <GradientText as="span" className="font-serif font-bold">
            workspace
          </GradientText>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#A0AEC0]">
          Google sign-in keeps your syllabus, progress, notes, revision queue,
          and profile synced securely under your account.
        </p>

        {!configured && (
          <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
            Firebase environment variables are missing. Add the{" "}
            <code className="rounded bg-black/30 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_FIREBASE_*
            </code>{" "}
            values before using the workspace.
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={!configured || loading}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-300 text-xs font-bold">
              G
            </span>
          )}
          Continue with Google
        </button>
      </GlassCard>
    </div>
  );
}
