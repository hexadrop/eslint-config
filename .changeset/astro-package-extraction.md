---
'@hexadrop/eslint-config-astro': patch
'@hexadrop/eslint-config': patch
---

Extract the astro concern into the new `@hexadrop/eslint-config-astro` package, publishable and usable standalone via its `astro()` factory. `@hexadrop/eslint-config-typescript` is declared as an optional peer: when present, the typescript flavor of the astro rules activates via presence detection; when absent, the package works in plain-js mode, and explicitly enabling the typescript flavor fails with an actionable install error. The meta-package composes it as a regular dependency with no behavior change.
