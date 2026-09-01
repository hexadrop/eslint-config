# Architecture

`typescriptConfig()` composes the package's ESLint v9 flat configuration for TypeScript files so consumers can use the typescript slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                             | Responsibility                                                                                                       |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                   | Exports the default `typescriptFactory()` and the named exports (globs, config names, options type).                 |
| `src/typescript.config.ts`       | Defines the typescript slice: `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` rules.              |
| `src/typescript.globs.ts`        | Stores the file globs the slice targets (`TYPESCRIPT_GLOBS`, `DTS_GLOBS`, `TEST_GLOBS`).                             |
| `src/typescript.config-name.ts`  | Stores the config names of the typescript slice.                                                                     |
| `src/typescript.parser.ts`       | The parser config helper — installs `@typescript-eslint/parser` with type-aware support.                             |
| `src/typescript.typed-config.ts` | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`. |
| `src/typescript.factory.ts`      | The public `FlatConfigComposer` factory that composes `typescriptConfig()` and appends consumer configs.             |
| `scripts/typegen.ts`             | Generates typed rules and configuration names.                                                                       |

## Pipeline

The config function returns an array of flat config items:

1. **Setup** (`hexadrop/typescript/setup`) — Installs the `@typescript-eslint` plugin renamed to `typescript`.
2. **Parser** (`hexadrop/typescript/setup/parser` or `/type-aware`) — Installs `@typescript-eslint/parser` on source files (or typescript files for type-aware mode).
3. **Rules** (`hexadrop/typescript/rules`) — Composes `eslint-recommended` overrides and `strict` rules on all source files.
4. **Rules DTS** (`hexadrop/typescript/rules/dts`) — Relaxed `triple-slash-reference` for `.d.ts` files.
5. **Rules Type-Aware** (`hexadrop/typescript/rules/type-aware`) — Type-checked-only rules when tsconfig paths are provided.
6. **Rules Test** (`hexadrop/typescript/rules/test`) — Relaxed `no-confusing-void-expression` for test files.

When `typescript` is `false`, the function returns an empty array.

## Parser configuration

The parser config assigns `sourceType: 'module'` and, when a tsconfig path is provided, also sets `project` and `tsconfigRootDir` for type-aware linting.

## Independence

The package must stay publishable standalone: it owns its dependencies (`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-flat-config-utils`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration). The local `TypedFlatConfigItem` is a one-line alias binding the shared generic to this package's generated `RuleOptions`.

## Dependency versions

See [Feature packages](../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`typescriptFactory()` accepts an optional options object (`{ typescript }`, defaults undefined) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import hexadropTypescript from '@hexadrop/eslint-config-typescript';

export default hexadropTypescript();
```

Named exports:

| Export                                                                                                                                                                                                                                                                          | Description                                              |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| `typescript`                                                                                                                                                                                                                                                                    | The raw typescript config function the factory composes. |
| `HexadropEslintTypescriptOptions`                                                                                                                                                                                                                                               | The factory options type.                                |
| `TYPESCRIPT_GLOBS` / `DTS_GLOBS` / `TEST_GLOBS`                                                                                                                                                                                                                                 | The ts, d.ts, and test file globs.                       |
| `TYPESCRIPT_CONFIG_NAME_SETUP` / `TYPESCRIPT_CONFIG_NAME_SETUP_PARSER` / `TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE` / `TYPESCRIPT_CONFIG_NAME_RULES` / `TYPESCRIPT_CONFIG_NAME_RULES_DTS` / `TYPESCRIPT_CONFIG_NAME_RULES_TEST` / `TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE` | Config names of the typescript slice.                    |

## Generated types

`scripts/typegen.ts` resolves the package's config pipeline and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
