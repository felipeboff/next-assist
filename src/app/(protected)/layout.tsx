import { Suspense, type ReactNode } from "react";
import { PageLoading } from "@/shared/presentation/ui";
import { requireUser } from "./require-user";

async function SessionGuard({ children }: { children: ReactNode }) {
  await requireUser();
  return children;
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PageLoading label="Carregando sua sessão…" />}>
      <SessionGuard>{children}</SessionGuard>
    </Suspense>
  );
}
