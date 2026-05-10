"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { SignInPanel } from "@/components/auth/sign-in-panel";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#A0AEC0]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
        Loading workspace
      </div>
    );
  }

  if (!user) return <SignInPanel />;

  return <>{children}</>;
}
