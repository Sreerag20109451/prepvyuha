import type { HTMLAttributes } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  glow?: "purple" | "none";
};

export function GlassCard({
  className = "",
  glow = "none",
  children,
  ...rest
}: GlassCardProps) {
  const glowClass =
    glow === "purple"
      ? "shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      : "shadow-[0_0_30px_rgba(0,0,0,0.35)]";

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${glowClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
