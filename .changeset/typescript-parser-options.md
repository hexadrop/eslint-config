---
'@hexadrop/eslint-config-typescript': minor
'@hexadrop/eslint-config': minor
---

Expose `parserOptions` on the TypeScript factory and the meta-package `typescript` option. Extra typescript-eslint parser options are merged into the type-aware parser config after the internal `project`/`tsconfigRootDir`, which makes `projectService` (solution-style tsconfigs and workspaces) available without replacing the whole parser configuration. When `projectService` is set, `project` is omitted so both resolution modes are never enabled at once.
