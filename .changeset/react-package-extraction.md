---
'@hexadrop/eslint-config-react': patch
'@hexadrop/eslint-config': patch
---

Extract the React concern into the new `@hexadrop/eslint-config-react` package, publishable and usable standalone via its `react()` factory. The meta-package composes it as a regular dependency with no behavior change.