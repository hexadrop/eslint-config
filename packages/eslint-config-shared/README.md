# @hexadrop/eslint-config-shared

**Private package. Never published.**

Internal types, constants, utilities and file globs used by the published `@hexadrop/eslint-config` packages. It has no factory and no ESLint config of its own: each feature package imports what it needs and tsdown's `deps.alwaysBundle` inlines it into that package's `dist/`, so consumers only ever install the published packages.

Keeping the shared layer private is what lets the feature packages stay independent of each other and of `@hexadrop/eslint-config-core`: a package owns its plugins and pulls in only the globs and helpers it uses.

## Contents

- `GLOB_*` constants — the file globs shared by several packages.
- `PLUGIN_RENAME_*` maps and `pluginConfigRules`/`pluginConfigOverrideRules` helpers.
- `interopDefault`, `toArray`, `extractTypedFlatConfigItem`, `combine`, `renameRules` and the `RecursivePartial` type.
- `expandTsconfigProjects` — expands a solution-style root tsconfig into the concrete projects it references.

Changes here affect every package: run `bun run build` and `bun run test` from the repository root before opening a pull request.
