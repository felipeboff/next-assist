"use client";

import { createContext, use, type ReactNode } from "react";
import type { SignIn } from "@/modules/identity/application/use-cases/sign-in";

export type IdentityDependencies = Readonly<{
  signIn: SignIn;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}>;

const IdentityDependenciesContext = createContext<IdentityDependencies | null>(null);

export function IdentityDependenciesProvider({
  value,
  children,
}: {
  value: IdentityDependencies;
  children: ReactNode;
}) {
  return <IdentityDependenciesContext value={value}>{children}</IdentityDependenciesContext>;
}

export function useIdentityDependencies(): IdentityDependencies {
  const dependencies = use(IdentityDependenciesContext);
  if (!dependencies) {
    throw new Error("useIdentityDependencies must be used inside IdentityDependenciesProvider");
  }
  return dependencies;
}
