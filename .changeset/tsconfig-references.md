---
'@hexadrop/eslint-config-core': minor
'@hexadrop/eslint-config-typescript': minor
'@hexadrop/eslint-config': minor
---

Support solution-style tsconfigs (`files: []` plus `references`). The configured project is expanded recursively into its concrete projects (cycles cut, duplicates removed, JSONC comments and trailing commas accepted), and the expanded list is used by both the TypeScript parser and `eslint-import-resolver-typescript`, so a root solution tsconfig works with plain `hexadrop({ typescript: true })` and alias imports resolve through the referenced projects.
