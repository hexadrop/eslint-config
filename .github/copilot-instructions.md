# Copilot instructions for @hexadrop/eslint-config

## Repository overview

This is an opinionated ESLint flat config package published as `@hexadrop/eslint-config`. It composes ESLint v9 flat configs from multiple plugins, renames plugin prefixes for a consistent DX, and supports TypeScript, React, Astro, JSON, and Markdown.

The package is built with `tsdown` to `dist/`, consumed from `./dist/index.mjs`. Source code lives in `src/`.

## Development environment

- **Runtime / package manager:** Bun (`bun`)
- **Module system:** ESM (`"type": "module"`)
- **TypeScript config:** extends `@hexadrop/tsconfig` and adds `types: ["bun"]`
- **Entry point:** `src/index.ts` → `dist/index.mjs`

## Build, test, and lint commands

Use `bun` for all commands. There is no test script in `package.json`; the repository currently does not contain unit tests.

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun run build` | Generate rule types and bundle the package into `dist/` |
| `bun run build:types` | Run `scripts/typegen.ts` to regenerate `src/typegen.d.ts` |
| `bun run lint` | Lint the project with `eslint --cache .` |
| `bun run lint:ci` | Lint with content-based cache strategy for CI |
| `bun run lint:fix` | Lint and auto-fix issues |
| `bun run typecheck` | Run `tsc --noEmit` |
| `bun changeset add` | Add a changeset for release versioning |

**Note on `bun test`:** `package.json` does not define a test script and there are no test files. The contributing guide mentions `bun test` for legacy/workflow reasons, but it is not used by CI. CI only runs `lint:ci` and `typecheck`.

## High-level architecture

### Config pipeline

`src/factory.ts` exports the default `hexadrop()` factory. It builds a `FlatConfigComposer` from `eslint-flat-config-utils` in this fixed order:

1. `ignore` — `.gitignore` integration (`eslint-config-flat-gitignore`)
2. `core` — base ESLint recommended-ish rules plus `eslint-plugin-n` rules
3. `astro` — Astro support (only if detected/requested)
4. `typescript` — TypeScript parser and rules
5. `react` — React / hooks / refresh rules
6. `json` — JSON/C support
7. `markdown` — Markdown code-block linting
8. `imports` — import validation, sorting, and unused-import cleanup
9. `stylistic` — `@stylistic/eslint-plugin`, unicorn, perfectionist, and Prettier-via-`eslint-plugin-format`

Each directory under `src/config/` is responsible for one concern and exports a default async function that returns `TypedFlatConfigItem[]`.

### Plugin prefix renaming

The config renames plugin prefixes so users see consistent short prefixes. The rename map is in `src/const/plugin-rename.ts`:

| New prefix | Original |
|------------|----------|
| `style/*` | `@stylistic/*` |
| `typescript/*` | `@typescript-eslint/*` |
| `import/*` | `import-x/*` |
| `json/*` | `jsonc/*` |
| `node/*` | `n/*` |
| `import-sort/*` | `simple-import-sort/*` |
| `import-unused/*` | `unused-imports/*` |
| `test/*` | `vitest/*` |
| `yaml/*` | `yml/*` |

When disabling rules inline or overriding them in user configs, use the **renamed prefix** (e.g. `typescript/consistent-type-definitions`, not `@typescript-eslint/consistent-type-definitions`).

### Options and detection

`src/options/hexadrop-eslint.options.ts` contains `defaultOptions()`. Features are auto-enabled based on installed packages:

- `typescript`: enabled if `typescript` is installed and `tsconfig.json` exists; otherwise `false`
- `react`: enabled if `react` is installed
- `astro`: enabled if `astro` is installed
- `ignore`, `imports`, `json`, `markdown`, `node`: enabled by default
- `stylistic`: enabled by default; can be disabled with `stylistic: false`

Pass `typescript: true` to force TypeScript without type-aware rules, or pass a string / array of strings to a `tsconfig.json` path to enable type-aware rules.

### Type generation

`scripts/typegen.ts` resolves the full config pipeline and uses `eslint-typegen` to generate `src/typegen.d.ts`. This file exports:

- Typed `RuleOptions` for all enabled rules
- `ConfigNames` union of every named config item

Always regenerate it after adding new plugins or renaming rules:

```bash
bun run build:types
```

### User-facing API

`hexadrop()` accepts an options object (or flat config item) plus any number of additional flat config overrides. It returns a `FlatConfigComposer`, so callers can chain `.override()`, `.prepend()`, `.append()`, `.remove()`, `.renamePlugins()`.

Example:

```js
import hexadrop from '@hexadrop/eslint-config';

export default hexadrop(
  { react: true, typescript: true },
  {
    files: ['**/*.ts'],
    rules: { 'style/indent': 'off' },
  }
);
```

## Key conventions

### Code style (enforced by the config itself)

- Tabs for indentation, 4 spaces per tab
- Single quotes, semicolons, trailing commas (ES5)
- 120 character print width
- Always use curly braces
- Sorted imports via `simple-import-sort` (renamed to `import-sort/*`)
- No inline comments (`no-inline-comments`)
- Prefer arrow callbacks

### File organization

- Each config concern lives in `src/config/<concern>/` with:
  - `<concern>.config.ts` — main config function
  - `<concern>.config-name.ts` — named constants for `name` fields
  - `<concern>.globs.ts` — file globs
  - `index.ts` — re-export
- `src/options/` contains option interfaces and the default-options resolver
- `src/utils/` contains small helpers: `combine`, `interopDefault`, `pluginConfigRules`, `renameRules`, `extractTypedFlatConfigItem`, etc.
- `src/const/` contains plugin rename maps

### Config names

Every config object must have a `name`. Names follow the pattern `hexadrop/<concern>/<purpose>` (e.g. `hexadrop/typescript/rules`, `hexadrop/stylistic/rules/prettier`). These names are referenced by `FlatConfigComposer` for overrides and appear in `ConfigNames`.

### `TypedFlatConfigItem`

Defined in `src/types/typed-flat-config-item.ts`, it is an ESLint `Linter.Config` whose `rules` are typed against the generated `RuleOptions`. Use it when adding new config objects so rules are type-checked.

### Import plugin notes

- Uses `eslint-plugin-import-x` but exposes it as `import/*`
- TypeScript resolver is `eslint-import-resolver-typescript`
- Node resolver is from `eslint-plugin-import-x`
- Unused imports are handled by `eslint-plugin-unused-imports` (exposed as `import-unused/*`)
- Import sorting is handled by `eslint-plugin-simple-import-sort` (exposed as `import-sort/*`)

### `interopDefault`

Always use the `interopDefault` helper when dynamically importing plugins to handle both ESM default and CommonJS exports safely:

```ts
const plugin = await interopDefault(import('some-plugin'));
```

### Async config functions

All config functions in `src/config/` are async and return `Promise<TypedFlatConfigItem[]>`. This lets them lazy-load plugins and parsers.

## Release workflow

The project uses **Changesets** and GitFlow:

- Work happens on `feature/*` branches merged into `develop`.
- Add a changeset for any package behavior change: `bun changeset add`.
- `release-prepare.yml` creates/updates a release PR from `develop` to `main`.
- Merging the release PR into `main` publishes to npm under `latest`.
- `sync-to-develop.yml` opens a PR to sync `main` back into `develop`.
- Beta snapshots are published from `develop` when changesets exist.

## Commit and branch conventions

- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `perf`, `test`, `build`, `ci`, `revert`)
- **Branch names:** `<type>/<short-description>` in lowercase with hyphens/underscores/dots
- **PRs:** Must reference an approved issue (`Closes #N`) and have exactly one `type:*` label

## Husky / git hooks

- `pre-commit`: runs `bun lint-staged` (lints and auto-fixes all staged files)
- `pre-push`: not configured by default
- `commit-msg`: validates commit messages via commitlint

## Common tasks

### Add a new plugin

1. Add the dependency to `package.json`.
2. Create or update the relevant `src/config/<concern>/` directory.
3. Register plugin rename mapping in `src/const/plugin-rename.ts` if needed.
4. Regenerate types: `bun run build:types`.
5. Run `bun run lint` and `bun run typecheck`.
6. Add a changeset if behavior changes.

### Add or change a rule

1. Update the appropriate `src/config/<concern>/<concern>.config.ts`.
2. Use the **renamed prefix** in rule keys.
3. Add a config name constant if it needs a new named config.
4. Regenerate types: `bun run build:types`.

### Verify the generated config

Use `@eslint/config-inspector` (already a dev dependency):

```bash
npx @eslint/config-inspector
```
