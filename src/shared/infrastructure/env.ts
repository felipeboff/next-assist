import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  BETTER_AUTH_SECRET: z.string().min(32, { error: "BETTER_AUTH_SECRET must have at least 32 characters" }),
  BETTER_AUTH_URL: z.url({ protocol: /^https?$/ }),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables (see .env.example):\n${problems}`);
  }
  return result.data;
}

export const env: ServerEnv = parseServerEnv(process.env);
