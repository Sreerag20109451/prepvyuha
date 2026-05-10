"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";

export type ActionModalVariant = "default" | "danger" | "primary";

export type ActionModalButton = {
  label: string;
  variant?: ActionModalVariant;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
};

type ActionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /** Buttons render left-to-right; place cancel first, destructive/primary last. */
  actions: ActionModalButton[];
  /** Optional label for the top-right dismiss control (same as first cancel-style action). */
  showCloseButton?: boolean;
};

const variantClass: Record<ActionModalVariant, string> = {
  default:
    "border border-white/15 bg-white/[0.06] text-[#A0AEC0] hover:bg-white/10 hover:text-white",
  danger:
    "border border-red-500/35 bg-red-500/10 text-red-200 hover:bg-red-500/20",
  primary:
    "border border-purple-400/35 bg-purple-500/20 font-medium text-[#E9D8FD] shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:bg-purple-500/30",
};

export function ActionModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  actions,
  showCloseButton = true,
}: ActionModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [busyIndex, setBusyIndex] = useState<number | null>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => setBusyIndex(null));
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && busyIndex === null) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, busyIndex]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const root = panelRef.current;
      if (!root) return;
      const focusable = root.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  async function runAction(i: number, fn: () => void | Promise<void>) {
    if (busyIndex !== null) return;
    setBusyIndex(i);
    try {
      await fn();
    } finally {
      setBusyIndex(null);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]" role="presentation">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-[3px]" />
      <button
        type="button"
        aria-label="Close dialog"
        className="fixed inset-0"
        onClick={busyIndex === null ? close : undefined}
      />
      <div className="fixed inset-0 grid place-items-center p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f14]/95 p-6 shadow-[0_0_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        {showCloseButton && busyIndex === null ? (
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-lg p-1 text-[#A0AEC0] hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

        <div className="flex gap-3 pr-8">
          {icon ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#D6BCFA]">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="font-serif text-xl font-normal text-white md:text-2xl"
            >
              {title}
            </h2>
            {description ? (
              <div className="mt-2 text-sm leading-relaxed text-[#A0AEC0]">
                {description}
              </div>
            ) : null}
          </div>
        </div>

        {children ? <div className="mt-4 text-sm text-[#A0AEC0]">{children}</div> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {actions.map((a, i) => {
            const v = a.variant ?? "default";
            const loading = busyIndex === i;
            const disabled = Boolean(a.disabled || busyIndex !== null);
            return (
              <button
                key={`${a.label}-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => void runAction(i, a.onClick)}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors disabled:opacity-50 ${variantClass[v]}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    {a.label}
                  </>
                ) : (
                  a.label
                )}
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </div>,
    document.body,
  );
}
