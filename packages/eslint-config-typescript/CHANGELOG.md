# @hexadrop/eslint-config-typescript

## 1.3.0

### Minor Changes

- 9aa4206: Support solution-style tsconfigs (`files: []` plus `references`). The configured project is expanded recursively into its concrete projects (cycles cut, duplicates removed, JSONC comments and trailing commas accepted), and the expanded list is used by both the TypeScript parser and `eslint-import-resolver-typescript`, so a root solution tsconfig works with automatic detection — `hexadrop()` picks up `./tsconfig.json` — and alias imports resolve through the referenced projects.

  Expanded references are passed to the parser and the resolver as absolute paths, resolved from the config that declares them. Project entries that cannot be expanded — non-solution configs, glob patterns and missing files — are forwarded unchanged.

- 8467bef: Expose `parserOptions` on the TypeScript factory and the meta-package `typescript` option. Extra typescript-eslint parser options are merged into the type-aware parser config after the internal `project`/`tsconfigRootDir`, which makes `projectService` (solution-style tsconfigs and workspaces) available without replacing the whole parser configuration. When `projectService` is set, `project` becomes optional and is omitted from the parser options so both resolution modes are never enabled at once; `tsconfigRootDir` is still forwarded.

### Patch Changes

- 549d5a0: fix(deps): update typescript-eslint monorepo to v8.69.0

## 1.2.0

### Minor Changes

- 9aa4206: Support solution-style tsconfigs (`files: []` plus `references`). The configured project is expanded recursively into its concrete projects (cycles cut, duplicates removed, JSONC comments and trailing commas accepted), and the expanded list is used by both the TypeScript parser and `eslint-import-resolver-typescript`, so a root solution tsconfig works with automatic detection — `hexadrop()` picks up `./tsconfig.json` — and alias imports resolve through the referenced projects.

  Expanded references are passed to the parser and the resolver as absolute paths, resolved from the config that declares them. Project entries that cannot be expanded — non-solution configs, glob patterns and missing files — are forwarded unchanged.

- 8467bef: Expose `parserOptions` on the TypeScript factory and the meta-package `typescript` option. Extra typescript-eslint parser options are merged into the type-aware parser config after the internal `project`/`tsconfigRootDir`, which makes `projectService` (solution-style tsconfigs and workspaces) available without replacing the whole parser configuration. When `projectService` is set, `project` becomes optional and is omitted from the parser options so both resolution modes are never enabled at once; `tsconfigRootDir` is still forwarded.

### Patch Changes

- 549d5a0: fix(deps): update typescript-eslint monorepo to v8.69.0

## 1.1.0

### Patch Changes

- e5004c2: Extract the TypeScript concern into the new `@hexadrop/eslint-config-typescript` package, publishable and usable standalone via its `typescript()` factory. The meta-package composes it as a regular dependency with no behavior change.
