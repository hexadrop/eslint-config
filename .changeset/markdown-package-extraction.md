---
'@hexadrop/eslint-config-markdown': patch
'@hexadrop/eslint-config': patch
---

Extract the markdown concern into the new `@hexadrop/eslint-config-markdown` package, publishable and usable standalone via its `markdown()` factory. The meta-package composes it as a regular dependency with no behavior change.
