import { test } from 'node:test';
import assert from 'node:assert/strict';

import { levenshtein, jaroWinkler } from '../src/index.js';

test('levenshtein: identical strings have distance 0', () => {
  assert.equal(levenshtein('abc', 'abc'), 0);
});

test('levenshtein: empty vs non-empty has distance equal to the non-empty length', () => {
  assert.equal(levenshtein('', 'abc'), 3);
  assert.equal(levenshtein('abc', ''), 3);
});

test('levenshtein: simple substitution costs 1', () => {
  assert.equal(levenshtein('kitten', 'sitten'), 1);
});

test('levenshtein: insertion and deletion are handled', () => {
  assert.equal(levenshtein('abc', 'abcd'), 1);
  assert.equal(levenshtein('abcd', 'abc'), 1);
});

test('levenshtein: classic kitten/sitting distance is 3', () => {
  assert.equal(levenshtein('kitten', 'sitting'), 3);
});

test('levenshtein: unicode characters are treated as single code units', () => {
  // The implementation works with UTF-16 code units as indexed by JS strings.
  assert.equal(levenshtein('café', 'cafe'), 1);
});

test('jaroWinkler: identical strings return 1', () => {
  assert.equal(jaroWinkler('abc', 'abc'), 1);
});

test('jaroWinkler: empty string against non-empty returns 0', () => {
  assert.equal(jaroWinkler('', 'abc'), 0);
  assert.equal(jaroWinkler('abc', ''), 0);
});

test('jaroWinkler: completely different strings return 0', () => {
  assert.equal(jaroWinkler('abc', 'xyz'), 0);
});

test('jaroWinkler: prefix bonus increases similarity for a shared prefix', () => {
  const noPrefix = jaroWinkler('martha', 'marhta');
  const withPrefix = jaroWinkler('martha', 'martha');
  assert.ok(noPrefix > 0 && noPrefix < 1);
  assert.equal(withPrefix, 1);
  assert.ok(withPrefix > noPrefix);
});

test('jaroWinkler: prefix bonus is capped at four characters', () => {
  const a = 'abcdefgh';
  const b = 'abcdefgi';
  const c = 'abcdeghi';
  // Both share a four-character prefix, so the bonus portion is identical.
  const first = jaroWinkler(a, b);
  const second = jaroWinkler(a, c);
  assert.ok(Math.abs(first - second) < 1e-12);
});
