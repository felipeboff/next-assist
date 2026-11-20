"use client";

import type { ReactNode } from "react";
import { IdentityDependenciesProvider, makeIdentityClientModule } from "@/modules/identity/client";

const identity = makeIdentityClientModule();

export function ClientProviders({ children }: { children: ReactNode }) {
  return <IdentityDependenciesProvider value={identity}>{children}</IdentityDependenciesProvider>;
}
