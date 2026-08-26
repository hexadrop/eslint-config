# Architecture

## Config pipeline

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

Each directory under `src/config` is responsible for one concern and exports a default async function that returns `Promise<TypedFlatConfigItem[]>`.

## Plugin prefix renaming

The config renames plugin prefixes so users see consistent short prefixes. The rename map lives in `src/const/plugin-rename.ts`:

| New prefix        | Original               |
|-------------------|------------------------|
| `style/*`         | `@stylistic/*`         |
| `typescript/*`    | `@typescript-eslint/*` |
| `import/*`        | `import-x/*`           |
| `json/*`          | `jsonc/*`              |
| `node/*`          | `n/*`                  |
| `import-sort/*`   | `simple-import-sort/*` |
| `import-unused/*` | `unused-imports/*`     |
| `test/*`          | `vitest/*`             |
| `yaml/*`          | `yml/*`                |

When disabling rules inline or overriding them in user configs, use the **renamed prefix** (e.g. `typescript/consistent-type-definitions`, not `@typescript-eslint/consistent-type-definitions`).

## Options and detection

`src/options/hexadrop-eslint.options.ts` contains `defaultOptions()`. Features are auto-enabled based on installed packages:

- `typescript`: enabled if `typescript` is installed and `tsconfig.json` exists; otherwise `false`
- `react`: enabled if `react` is installed
- `astro`: enabled if `astro` is installed
- `ignore`, `imports`, `json`, `markdown`, `node`: enabled by default
- `stylistic`: enabled by default; can be disabled with `stylistic: false`

Pass `typescript: true` to force TypeScript without type-aware rules, or pass a string / array of strings to a `tsconfig.json` path to enable type-aware rules.

## Type generation

`scripts/typegen.ts` resolves the full config pipeline and uses `eslint-typegen` to generate `src/typegen.d.ts`. This file exports:

- Typed `RuleOptions` for all enabled rules
- `ConfigNames` union of every named config item

Always regenerate it after adding new plugins or renaming rules:

```bash
bun run build:types
```

## User-facing API

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
