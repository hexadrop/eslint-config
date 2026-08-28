# Architecture

`hexadrop()` composes the package's ESLint v9 flat configuration in a fixed, named pipeline so consumers can enable features and target overrides predictably.

## Entry points

| Area | Responsibility |
| --- | --- |
| `src/factory.ts` | Exports the default `hexadrop()` factory and creates the `FlatConfigComposer`. |
| `src/config/` | Defines one independent configuration concern per directory. |
| `src/options/` | Defines public options and resolves feature defaults. |
| `src/const/` | Stores shared constants, including plugin-prefix mappings. |
| `src/utils/` | Provides small composition and interop helpers. |
| `scripts/typegen.ts` | Generates typed rules and configuration names. |

## Configuration pipeline

The factory composes concerns in this order:

1. `ignore` — integrates `.gitignore` through `eslint-config-flat-gitignore`.
2. `core` — supplies base ESLint and `eslint-plugin-n` rules.
3. `astro` — adds Astro support when requested or detected.
4. `typescript` — configures the TypeScript parser and rules.
5. `react` — configures React, hooks, and refresh rules.
6. `json` — supports JSON and JSONC.
7. `markdown` — lints Markdown code blocks.
8. `imports` — validates, sorts, and removes unused imports.
9. `stylistic` — applies stylistic, Unicorn, Perfectionist, and Prettier-via-format rules.

Each `src/config/<concern>/` module exports an async default function returning `Promise<TypedFlatConfigItem[]>`.

## Public API

`hexadrop()` accepts an options object or a flat config item followed by additional overrides. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

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

## Feature resolution

`defaultOptions()` in `src/options/hexadrop-eslint.options.ts` enables `ignore`, `imports`, `json`, `markdown`, `node`, and `stylistic` by default. It enables `react`, `astro`, and `typescript` when their packages are installed; a root `tsconfig.json` automatically enables TypeScript's type-aware configuration.

Set `typescript: true` to enable TypeScript without type-aware rules. Pass one or more `tsconfig.json` paths to enable type-aware rules.

## Generated types

`scripts/typegen.ts` resolves the full pipeline and writes `src/generated.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
