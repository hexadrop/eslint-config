---
'@hexadrop/eslint-config-stylistic': patch
'@hexadrop/eslint-config': patch
---

Extract the stylistic concern into the new `@hexadrop/eslint-config-stylistic` package, publishable and usable standalone via its `stylistic()` factory. The meta-package composes it through `optionalPlugin()` with no behavior change. The optional peers on `@hexadrop/eslint-config-typescript`, `@hexadrop/eslint-config-astro` and `@typescript-eslint/eslint-plugin` gate the embedded sections via presence detection, and the `package.json`/`tsconfig.json` sort-keys slice comes from `@hexadrop/eslint-config-json`.
