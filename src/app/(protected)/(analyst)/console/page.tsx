import type { Metadata } from "next";
import { Suspense } from "react";
import { ConsoleScreen } from "@/modules/conversations";
import { PageLoading } from "@/shared/presentation/ui";
import { requireRole } from "../../require-user";

export const metadata: Metadata = {
  title: "Conversas",
};

async function AnalystConsole() {
  const user = await requireRole("analyst");
  return <ConsoleScreen analyst={{ id: user.id, name: user.name, email: user.email }} />;
}

export default function ConsolePage() {
  return (
    <Suspense fallback={<PageLoading label="Carregando conversas…" />}>
      <AnalystConsole />
    </Suspense>
  );
}
