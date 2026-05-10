import { PrepShell } from "@/components/layout/prep-shell";

export default function PrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrepShell>{children}</PrepShell>;
}
