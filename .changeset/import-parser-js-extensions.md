---
"@hexadrop/eslint-config-core": patch
"@hexadrop/eslint-config": patch
---

Parse imported `.cjs`, `.js` and `.mjs` files with `@typescript-eslint/parser` by default. This removes the need for consumers to add `import-x/parsers` manually when they import JavaScript modules from a dependency.
