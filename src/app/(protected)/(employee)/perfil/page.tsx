import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileScreen, findPasswordChangedAt } from "@/modules/identity";
import { LoadingState } from "@/shared/presentation/ui";
import { requireRole } from "../../require-user";

export const metadata: Metadata = {
  title: "Meu perfil",
};

async function EmployeeProfile() {
  const user = await requireRole("employee");
  const passwordChangedAt = await findPasswordChangedAt(user.id);
  return <ProfileScreen user={user} passwordChangedAt={passwordChangedAt} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando seu perfil…" />}>
      <EmployeeProfile />
    </Suspense>
  );
}
