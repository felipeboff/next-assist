import { randomBytes, randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { and, eq, sql } from "drizzle-orm";
import type { UserRole } from "@/modules/identity/domain/user-role";
import { account, user } from "@/modules/identity/infrastructure/identity.schema";
import type { Database } from "@/shared/infrastructure/db/client";

export type SeedPerson = {
  name: string;
  email: string;
  role: UserRole;
};

export const seedPeople: readonly SeedPerson[] = [
  { name: "Ana Souza", email: "ana.souza@nexo.com.br", role: "employee" },
  { name: "Bruno Carvalho", email: "bruno.carvalho@nexo.com.br", role: "employee" },
  { name: "Carla Mendes", email: "carla.mendes@nexo.com.br", role: "employee" },
  { name: "Diego Rocha", email: "diego.rocha@nexo.com.br", role: "employee" },
  { name: "Marina Lopes", email: "marina.lopes@nexo.com.br", role: "analyst" },
  { name: "Rafael Nunes", email: "rafael.nunes@nexo.com.br", role: "analyst" },
  // Easy-to-type accounts for trying the app (any password is accepted, e.g. 123456).
  { name: "Funcionário Exemplo", email: "employee@example.com", role: "employee" },
  { name: "Analista Exemplo", email: "analyst@example.com", role: "analyst" },
];

export async function seedIdentity(db: Database): Promise<number> {
  let created = 0;

  for (const person of seedPeople) {
    const userId = randomUUID();
    const [row] = await db
      .insert(user)
      .values({ id: userId, name: person.name, email: person.email, role: person.role, emailVerified: true })
      .onConflictDoUpdate({
        target: user.email,
        set: { name: person.name, role: person.role },
      })
      .returning({ id: user.id, isNew: sql<boolean>`(xmax = 0)` });

    const existingCredential = await db
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, row.id), eq(account.providerId, "credential")))
      .limit(1);

    if (existingCredential.length === 0) {
      await db.insert(account).values({
        id: randomUUID(),
        accountId: row.id,
        providerId: "credential",
        userId: row.id,
        password: await hashPassword(randomBytes(24).toString("base64url")),
      });
    }

    if (row.isNew) {
      created += 1;
    }
  }

  return created;
}
