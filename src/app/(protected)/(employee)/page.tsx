import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatScreen } from "@/modules/conversations";
import { LoadingState } from "@/shared/presentation/ui";
import { requireRole } from "../require-user";

export const metadata: Metadata = {
  title: "Atendimento",
};

async function EmployeeChat() {
  const user = await requireRole("employee");
  return <ChatScreen employee={{ email: user.email, name: user.name }} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando sua conversa…" />}>
      <EmployeeChat />
    </Suspense>
  );
}
