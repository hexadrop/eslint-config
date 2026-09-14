---
'@hexadrop/eslint-config-stylistic': major
'@hexadrop/eslint-config': patch
---

Extract the stylistic concern into the new `@hexadrop/eslint-config-stylistic` package, publishable and usable standalone via its `stylistic()` factory. The meta-package composes it through `optionalPlugin()` with no behavior change. `JSON_SORT_KEYS_CONFIG` is imported from `@hexadrop/eslint-config-json` instead of being inlined.