import { MessageSquare, UserRound } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { AccountFooter } from "@/modules/identity";
import { Brand, NavList, SidebarLayout } from "@/shared/presentation/ui";
import { requireRole } from "../require-user";

const employeeNav = [
  { href: "/", label: "Atendimento", icon: MessageSquare },
  { href: "/perfil", label: "Meu perfil", icon: UserRound },
];

async function SignedInEmployee() {
  const user = await requireRole("employee");
  return <AccountFooter name={user.name} email={user.email} />;
}

/** The shell renders at once; only the signed-in employee waits for the session. */
export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarLayout
      brand={<Brand />}
      nav={<NavList label="Navegação principal" items={employeeNav} />}
      footer={
        <Suspense fallback={null}>
          <SignedInEmployee />
        </Suspense>
      }
    >
      {children}
    </SidebarLayout>
  );
}
