# @hexadrop/eslint-config-core

## 1.2.0

### Minor Changes

- 9aa4206: Support solution-style tsconfigs (`files: []` plus `references`). The configured project is expanded recursively into its concrete projects (cycles cut, duplicates removed, JSONC comments and trailing commas accepted), and the expanded list is used by both the TypeScript parser and `eslint-import-resolver-typescript`, so a root solution tsconfig works with automatic detection — `hexadrop()` picks up `./tsconfig.json` — and alias imports resolve through the referenced projects.

  Expanded references are passed to the parser and the resolver as absolute paths, resolved from the config that declares them. Project entries that cannot be expanded — non-solution configs, glob patterns and missing files — are forwarded unchanged.

- 8467bef: Forward the configured TypeScript project(s) to `eslint-import-resolver-typescript`, so `import/no-unresolved` resolves tsconfig `paths` aliases without a consumer `settings['import-x/resolver-next']` override. `typescript` now accepts `{ project, tsconfigRootDir, resolver }`: project paths from `project` or `resolver.project` are resolved against `tsconfigRootDir` and resolver options (`bun`, `alwaysTryTypes`, `conditionNames`, `noWarnOnMultipleProjects`, …) are forwarded untouched.

### Patch Changes

- d2b79b4: Keep the default ignore globs when `ignore: true` and the working directory has no `.gitignore`. Previously the whole ignore slice was dropped, so `node_modules`, `dist`, lock files and the other defaults were linted.
- 49474aa: fix(deps): update dependency eslint-config-flat-gitignore to v2.4.0
- 1b00982: fix(deps): update dependency globals to v17.12.0
- 0a5bfe8: Silence `eslint-import-resolver-typescript`'s "Multiple projects found" warning when the resolver receives the project list forwarded from the `typescript` option. Solution-style tsconfigs intentionally expand to several projects, so the warning was noise in every monorepo run; set `resolver.noWarnOnMultipleProjects: false` to opt back in.

## 1.1.0

### Patch Changes

- d5d86b8: Extract the core concern into the new `@hexadrop/eslint-config-core` package, publishable and usable standalone via its `core()` factory. The meta-package composes the raw `core`, `ignore` and `imports` configs with no behavior change. The file globs stay in the private `@hexadrop/eslint-config-shared` package and are bundled into each published package, so feature packages do not depend on core; each package only ships the globs it imports.
