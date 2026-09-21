# Similarity

Similarity provides Levenshtein edit distance and Jaro-Winkler string similarity for short strings. It has no third-party dependencies and ships as ES modules only.

```js
import { levenshtein, jaroWinkler } from 'similarity';

levenshtein('kitten', 'sitting'); // 3
jaroWinkler('martha', 'marhta');  // ~0.9611
```

## Why this library exists

Fuzzy matching short strings is common in record linkage, search, and data cleaning. The two algorithms here answer different questions: Levenshtein tells you how many edits separate two strings, while Jaro-Winkler returns a similarity score that rewards shared prefixes. The trade-off is that Jaro-Winkler is tuned for names and short identifiers; it is not a general-purpose similarity measure for long documents.

## Edge cases

- Both functions treat strings as indexed by JavaScript UTF-16 code units. Characters outside the Basic Multilingual Plane count as two units.
- `levenshtein` always returns a non-negative integer.
- `jaroWinkler` always returns a number in `[0, 1]`.
- The Jaro-Winkler prefix bonus uses the original scale of 0.1 and is capped at four characters.

## Exports

- `levenshtein(a, b)` — number of single-character insertions, deletions, or substitutions.
- `jaroWinkler(a, b)` — similarity score between 0 and 1.
