# Architecture

The repository is a Bun workspaces monorepo. It publishes the zero-config meta-package plus one package per concern, so consumers can choose between the all-in-one preset and a granular install.

## Package graph

| Package | Role | Depends on |
|---|---|---|
| `@hexadrop/eslint-config` | Meta-package: option resolution, framework autodetection and composition. | All feature packages + `core`. |
| `@hexadrop/eslint-config-core` | Base ESLint rules, globals, ignores, `import-x` and `n`; core/ignore/imports config names and option types. | Its own plugins. |
| `@hexadrop/eslint-config-typescript` | TypeScript parser, plugin and type-aware rules. | Its own plugins. |
| `@hexadrop/eslint-config-json` | JSON/JSONC rules and the `package.json`/`tsconfig.json` sort-keys slice. | Its own plugins. |
| `@hexadrop/eslint-config-markdown` | Markdown processor and plain parser. | Its own plugins. |
| `@hexadrop/eslint-config-react` | React, hooks and refresh rules. | Optional peer: `-typescript`. |
| `@hexadrop/eslint-config-astro` | Astro plugin, parser and TS-in-astro. | Optional peer: `-typescript`. |
| `@hexadrop/eslint-config-stylistic` | `@stylistic`, Unicorn, Perfectionist and Prettier. | Optional peers: `-typescript`, `-astro`, `-json`. |
| `@hexadrop/eslint-config-shared` | **Private, never published**: types, constants, utilities and file globs. | — |

Feature packages do **not** depend on core. They import the shared globs and utilities from the private `shared` package, which is bundled into each package's `dist/` via tsdown `deps.alwaysBundle`, so each package only ships what it imports.

## Composition

`hexadrop()` builds the pipeline in this order:

1. `ignore` and `core` from `@hexadrop/eslint-config-core`.
2. `astro` when enabled or detected.
3. `typescript`.
4. `react` when enabled or detected.
5. `json`.
6. `markdown`.
7. `imports` from `@hexadrop/eslint-config-core`.
8. `stylistic` from `@hexadrop/eslint-config-stylistic`.

The base concerns are raw config functions imported from core. The framework concerns are loaded lazily with `optionalPlugin()` so their plugins are only evaluated when the section is enabled.

Each package exposes a factory that returns a `FlatConfigComposer`, plus named exports for its raw config pieces, config names and globs where they are public. The meta-package keeps the existing `hexadrop()` API and reproduces the 1.0.x resolved config.

## Typegen

Each package runs `eslint-typegen` over its own pipeline and writes a git-ignored `src/typegen.d.ts`. The meta-package combines every package's pipeline in `packages/eslint-config/scripts/typegen.ts`, which keeps the factory return types narrow.

## Related guides

- [Feature packages](feature-packages.md) — conventions every `packages/*` package follows.
- [Release process](release-process.md) — changesets, beta snapshots and stable releases.
- [Development](development.md) — commands and targeted validation.
