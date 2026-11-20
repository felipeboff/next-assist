/** Lower case, no accents, single spaces: "  Fábio  NUNES" and "fabio nunes" compare equal. */
export function normalizeForMatch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
