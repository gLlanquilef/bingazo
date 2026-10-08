// Figuras ganadoras sobre la matriz 5x5. Los índices son por fila: fila * 5 + columna.
// El centro (12) es casilla libre, así que siempre cuenta como marcado.

export interface Pattern {
  id: string;
  name: string;
  group: 'Letras' | 'Líneas' | 'Formas';
  /** Alternativas: la figura se completa cuando se completa cualquiera de ellas. */
  variants: number[][];
}

/** Convierte un dibujo ('#' = casilla, '.' = vacío) a índices. */
const draw = (art: string): number[] => {
  const cells = art.trim().split('\n').map((row) => row.trim()).join('');
  if (cells.length !== 25) throw new Error(`Figura inválida: ${art}`);
  return [...cells].flatMap((ch, i) => (ch === '#' ? [i] : []));
};

const mirror = (cells: number[]): number[] =>
  cells.map((i) => Math.floor(i / 5) * 5 + (4 - (i % 5)));

const rows = [0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => r * 5 + c));
const cols = [0, 1, 2, 3, 4].map((c) => [0, 1, 2, 3, 4].map((r) => r * 5 + c));
const diagonal = draw(`
  #....
  .#...
  ..#..
  ...#.
  ....#
`);
const diagonals = [diagonal, mirror(diagonal)];

export const PATTERNS: Pattern[] = [
  {
    id: 'h',
    name: 'H',
    group: 'Letras',
    variants: [draw(`
      #...#
      #...#
      #####
      #...#
      #...#
    `)],
  },
  {
    id: 't',
    name: 'T',
    group: 'Letras',
    variants: [draw(`
      #####
      ..#..
      ..#..
      ..#..
      ..#..
    `)],
  },
  {
    id: 'x',
    name: 'X',
    group: 'Letras',
    variants: [draw(`
      #...#
      .#.#.
      ..#..
      .#.#.
      #...#
    `)],
  },
  {
    id: 'l',
    name: 'L',
    group: 'Letras',
    variants: [draw(`
      #....
      #....
      #....
      #....
      #####
    `)],
  },
  {
    id: 'u',
    name: 'U',
    group: 'Letras',
    variants: [draw(`
      #...#
      #...#
      #...#
      #...#
      #####
    `)],
  },
  {
    id: 'i',
    name: 'I',
    group: 'Letras',
    variants: [draw(`
      #####
      ..#..
      ..#..
      ..#..
      #####
    `)],
  },
  {
    id: 'z',
    name: 'Z',
    group: 'Letras',
    variants: [draw(`
      #####
      ...#.
      ..#..
      .#...
      #####
    `)],
  },
  {
    id: 'n',
    name: 'N',
    group: 'Letras',
    variants: [draw(`
      #...#
      ##..#
      #.#.#
      #..##
      #...#
    `)],
  },
  {
    id: 'c',
    name: 'C',
    group: 'Letras',
    variants: [draw(`
      #####
      #....
      #....
      #....
      #####
    `)],
  },
  {
    id: 'e',
    name: 'E',
    group: 'Letras',
    variants: [draw(`
      #####
      #....
      #####
      #....
      #####
    `)],
  },
  {
    id: 'linea-h',
    name: 'Línea horizontal',
    group: 'Líneas',
    variants: rows,
  },
  {
    id: 'linea-v',
    name: 'Línea vertical',
    group: 'Líneas',
    variants: cols,
  },
  {
    id: 'diagonal',
    name: 'Diagonal',
    group: 'Líneas',
    variants: diagonals,
  },
  {
    id: 'cualquier-linea',
    name: 'Cualquier línea',
    group: 'Líneas',
    variants: [...rows, ...cols, ...diagonals],
  },
  {
    id: 'esquinas',
    name: 'Cuatro esquinas',
    group: 'Formas',
    variants: [draw(`
      #...#
      .....
      .....
      .....
      #...#
    `)],
  },
  {
    id: 'marco',
    name: 'Marco',
    group: 'Formas',
    variants: [draw(`
      #####
      #...#
      #...#
      #...#
      #####
    `)],
  },
  {
    id: 'cruz',
    name: 'Cruz',
    group: 'Formas',
    variants: [draw(`
      ..#..
      ..#..
      #####
      ..#..
      ..#..
    `)],
  },
  {
    id: 'diamante',
    name: 'Diamante',
    group: 'Formas',
    variants: [draw(`
      ..#..
      .###.
      #####
      .###.
      ..#..
    `)],
  },
  {
    id: 'corazon',
    name: 'Corazón',
    group: 'Formas',
    variants: [draw(`
      ##.##
      #####
      #####
      .###.
      ..#..
    `)],
  },
  {
    id: 'carton-lleno',
    name: 'Cartón lleno',
    group: 'Formas',
    variants: [draw(`
      #####
      #####
      #####
      #####
      #####
    `)],
  },
];

export const GROUPS: Pattern['group'][] = ['Letras', 'Líneas', 'Formas'];

export const DEFAULT_PATTERN_ID = 'cualquier-linea';

export const getPattern = (id: string): Pattern =>
  PATTERNS.find((p) => p.id === id) ?? PATTERNS.find((p) => p.id === DEFAULT_PATTERN_ID)!;
