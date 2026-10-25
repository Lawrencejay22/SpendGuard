import React from "react";
import { AppShell } from "@/components/app-shell";

export default function CustomerAppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
