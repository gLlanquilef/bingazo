import { test } from 'node:test';
import assert from 'node:assert/strict';
import { columnOf, parseCalls } from './bingo.ts';
import { PATTERNS, getPattern } from './patterns.ts';

test('columnOf respeta los rangos B-I-N-G-O', () => {
  assert.deepEqual([1, 15, 16, 30, 31, 45, 46, 60, 61, 75].map(columnOf), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
});

test('parseCalls acepta números, letras y listas', () => {
  const ok = (s: string) => parseCalls(s).map((r) => (r.ok ? r.n : null));
  assert.deepEqual(ok('7'), [7]);
  assert.deepEqual(ok('B7 i-22, 75'), [7, 22, 75]);
  assert.deepEqual(ok('n 40'), [40]);
  assert.deepEqual(ok('0 76 B20'), [null, null, null]);
});

test('todas las figuras tienen casillas válidas y sin repetir', () => {
  for (const p of PATTERNS) {
    assert.ok(p.variants.length > 0, p.id);
    for (const v of p.variants) {
      assert.ok(v.length > 0 && v.every((i) => i >= 0 && i < 25), p.id);
      assert.equal(new Set(v).size, v.length, p.id);
    }
  }
});

test('la H tiene 13 casillas y getPattern cae al valor por defecto', () => {
  assert.equal(getPattern('h').variants[0].length, 13);
  assert.equal(getPattern('no-existe').id, 'cualquier-linea');
});
