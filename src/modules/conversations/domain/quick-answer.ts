import { normalizeForMatch } from "@/modules/conversations/domain/text-match";

/**
 * A typed answer to a question with quick options counts as the option whose label starts the
 * text, ignoring case and accents ("so eu, desde ontem" is "Só eu"); otherwise it is `fallback`.
 */
export function matchOption(text: string, options: readonly string[], fallback: string): string {
  const answer = normalizeForMatch(text);
  const byLength = [...options].sort((a, b) => b.length - a.length);
  return byLength.find((option) => answer.startsWith(normalizeForMatch(option))) ?? fallback;
}
