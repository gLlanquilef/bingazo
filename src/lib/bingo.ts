export const LETTERS = ['B', 'I', 'N', 'G', 'O'] as const;
export const MAX_NUMBER = 75;

/** Columna 0..4 (B, I, N, G, O) a la que pertenece un número 1..75. */
export const columnOf = (n: number): number => Math.floor((n - 1) / 15);

export const letterOf = (n: number): string => LETTERS[columnOf(n)];

export const label = (n: number): string => `${letterOf(n)}${n}`;

export type ParsedCall = { ok: true; n: number } | { ok: false; token: string; error: string };

/**
 * Interpreta texto como "7", "B7", "b-7", "I 22" o varios separados por espacio/coma.
 * Si trae letra, debe coincidir con la columna del número.
 */
export const parseCalls = (input: string): ParsedCall[] => {
  const results: ParsedCall[] = [];
  for (const [token, letter, digits] of input.matchAll(/([bingo])?[\s-]*(\d+)/gi)) {
    const n = Number(digits);
    if (n < 1 || n > MAX_NUMBER) {
      results.push({ ok: false, token: token.trim(), error: `${n} no está entre 1 y ${MAX_NUMBER}` });
    } else if (letter && letter.toUpperCase() !== letterOf(n)) {
      results.push({ ok: false, token: token.trim(), error: `${n} es de la columna ${letterOf(n)}, no ${letter.toUpperCase()}` });
    } else {
      results.push({ ok: true, n });
    }
  }
  return results;
};
