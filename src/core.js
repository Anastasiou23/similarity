/**
 * Compute the Levenshtein edit distance between two strings.
 *
 * This is the minimum number of single-character insertions, deletions,
 * or substitutions required to change one string into the other. It is
 * implemented with two rolling rows because that keeps memory usage to
 * O(min(m, n)) while remaining straightforward to audit.
 *
 * @param {string} a - first string
 * @param {string} b - second string
 * @returns {number} non-negative integer edit distance
 */
export function levenshtein(a, b) {
  if (a === b) return 0;

  // Swap so the shorter string is the row we iterate over. This reduces
  // the number of cells touched and keeps the implementation symmetrical.
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const m = a.length;
  const n = b.length;

  let previous = new Array(m + 1);
  let current = new Array(m + 1);

  for (let i = 0; i <= m; i += 1) {
    previous[i] = i;
  }

  for (let j = 1; j <= n; j += 1) {
    current[0] = j;

    for (let i = 1; i <= m; i += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[i] = Math.min(
        previous[i] + 1, // deletion
        current[i - 1] + 1, // insertion
        previous[i - 1] + substitutionCost // substitution
      );
    }

    [previous, current] = [current, previous];
  }

  return previous[m];
}

/**
 * Compute the Jaro-Winkler similarity between two strings.
 *
 * Jaro similarity measures how many matching characters appear within a
 * limited window, penalizing transpositions. Winkler extends that by
 * giving a bonus to strings that share a common prefix. The result is
 * normalized to the inclusive range [0, 1].
 *
 * The prefix scale is fixed at 0.1 and the prefix bonus is capped at four
 * characters, which are the values used by Winkler's original definition.
 *
 * @param {string} a - first string
 * @param {string} b - second string
 * @returns {number} similarity between 0 and 1
 */
export function jaroWinkler(a, b) {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const matchDistance = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  const aMatches = new Array(a.length).fill(false);
  const bMatches = new Array(b.length).fill(false);
  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < a.length; i += 1) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, b.length);

    for (let j = start; j < end; j += 1) {
      if (bMatches[j] || a[i] !== b[j]) continue;

      aMatches[i] = true;
      bMatches[j] = true;
      matches += 1;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < a.length; i += 1) {
    if (!aMatches[i]) continue;

    while (!bMatches[k]) {
      k += 1;
    }

    if (a[i] !== b[k]) {
      transpositions += 1;
    }

    k += 1;
  }

  const jaro =
    (matches / a.length +
      matches / b.length +
      (matches - transpositions / 2) / matches) /
    3;

  let prefix = 0;
  const maxPrefix = Math.min(4, a.length, b.length);
  while (prefix < maxPrefix && a[prefix] === b[prefix]) {
    prefix += 1;
  }

  return jaro + prefix * 0.1 * (1 - jaro);
}
