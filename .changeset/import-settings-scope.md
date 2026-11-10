---
"@hexadrop/eslint-config-core": patch
"@hexadrop/eslint-config": patch
---

Apply the `import-x` extensions, external module folders, parser and TypeScript resolver settings to every file, not only to TypeScript files. Astro and other non-TypeScript files now parse imported JavaScript and TypeScript modules with `@typescript-eslint/parser`, so consumers no longer need a manual `import-x/parsers` block.
