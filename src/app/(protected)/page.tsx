import { WelcomeScreen } from "@/modules/identity";
import { requireUser } from "./require-user";

export default async function HomePage() {
  const user = await requireUser();
  return <WelcomeScreen user={user} />;
}
