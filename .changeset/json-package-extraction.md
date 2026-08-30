---
'@hexadrop/eslint-config-json': patch
'@hexadrop/eslint-config': patch
---

Extract the json concern into the new `@hexadrop/eslint-config-json` package, publishable and usable standalone via its `json()` factory. The meta-package composes it as a regular dependency with no behavior change.
