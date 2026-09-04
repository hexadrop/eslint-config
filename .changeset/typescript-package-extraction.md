---
'@hexadrop/eslint-config-typescript': patch
'@hexadrop/eslint-config': patch
---

Extract the TypeScript concern into the new `@hexadrop/eslint-config-typescript` package, publishable and usable standalone via its `typescript()` factory. The meta-package composes it as a regular dependency with no behavior change.