import React from "react";
import { AppShell } from "@/components/app-shell";

export default function ModeratorLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
