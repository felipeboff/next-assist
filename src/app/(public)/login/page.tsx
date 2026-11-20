import type { Metadata } from "next";
import { LoginScreen } from "@/modules/identity";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return <LoginScreen />;
}
