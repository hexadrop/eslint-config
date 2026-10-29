---
'@hexadrop/eslint-config-stylistic': patch
---

Make `@hexadrop/eslint-config-json` an optional peer of the stylistic package instead of a regular dependency. The json section was already gated by `local-pkg` presence detection, but the hard dependency made it always present; standalone stylistic consumers now only get the json rules when `-json` is installed, while the meta-package keeps the same resolved config because it passes explicit flags and depends on `-json` directly.
