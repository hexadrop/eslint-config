---
'@hexadrop/eslint-config-stylistic': patch
'@hexadrop/eslint-config': patch
---

Decompose the stylistic mega-module into one adapter per concern (base, typescript, json, astro, unicorn, perfectionist and format). `format`, `unicorn` and `perfectionist` become top-level options of the standalone `stylistic()` factory; the meta-package keeps them nested under `stylistic` and maps them, so the resolved config is unchanged.
