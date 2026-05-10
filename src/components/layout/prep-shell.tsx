"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  BookOpenText,
  ClipboardList,
  Home,
  ListChecks,
  LogOut,
  StickyNote,
} from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/contexts/auth-context";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/notes/reader", label: "Reader", icon: BookOpenText },
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: ListChecks },
  { href: "/revision", label: "Revision", icon: ClipboardList },
];

export function PrepShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();

  return (
    <AuthGate>
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="flex shrink-0 flex-row items-center gap-1 border-b border-white/10 bg-black/20 px-3 py-3 backdrop-blur-xl md:w-[76px] md:flex-col md:border-b-0 md:border-r md:py-8">
          <Link
            href="/"
            className="mb-0 mr-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-lg font-bold text-white md:mb-8 md:mr-0"
            aria-label="PrepVyuha home"
          >
            PV
          </Link>
          <nav className="flex flex-1 justify-center gap-1 md:flex-col md:justify-start">
            {nav.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : href === "/notes"
                    ? pathname === "/notes" || pathname === "/notes/"
                    : href === "/notes/reader"
                      ? pathname.startsWith("/notes/reader")
                      : href === "/practice"
                        ? pathname.startsWith("/practice")
                        : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                    active
                      ? "border-purple-500/40 bg-purple-500/15 text-[#D6BCFA] shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                      : "border-transparent text-[#A0AEC0] hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 backdrop-blur-xl md:px-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#A0AEC0]">
                PrepVyuha
              </p>
              <p className="text-sm text-white/90">
                {user?.displayName ?? "All-in-one UPSC workspace"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-colors hover:border-purple-400/40"
              >
                Landing
              </Link>
              <button
                type="button"
                onClick={() => void signOutUser()}
                title="Sign out"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-[#A0AEC0] transition-colors hover:border-purple-400/40 hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </header>
          <main
            className={
              pathname.startsWith("/notes")
                ? "flex-1 px-2 py-2 md:px-4 md:py-3"
                : "flex-1 px-4 py-8 md:px-10"
            }
          >
            {children}
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
