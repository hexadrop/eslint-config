# Architecture

`coreFactory()` composes the package's ESLint v9 flat configuration for the universal concerns so consumers can use the core slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                          | Responsibility                                                                                                                  |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                | Exports the default `coreFactory()`, the raw `core`/`ignore`/`imports` config functions, the universal globs and config names.  |
| `src/core.config.ts`          | Defines the base ESLint rules, globals and the `eslint-plugin-n` integration.                                                    |
| `src/ignore.config.ts`        | Defines the default ignores and the `eslint-config-flat-gitignore` integration.                                                  |
| `src/imports.config.ts`       | Defines the `import-x`, `simple-import-sort` and `unused-imports` rules.                                                         |
| `src/core.factory.ts`         | `coreFactory(options?, ...configs)` returns a `FlatConfigComposer` composing `ignore`, `core` and `imports`.                     |
| `src/core.options.ts`         | Public option types and `defaultCoreOptions()`.                                                                                  |
| `src/core.typed-config.ts`    | Local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`.                          |
| `src/globs/`                  | Universal file globs used by every feature package.                                                                              |
| `src/config-names/`           | Config names for the core, ignore and imports concerns.                                                                          |
| `scripts/typegen.ts`          | Generates typed rules and configuration names.                                                                                   |

## Sections

`coreFactory()` emits its config items in this order:

1. `ignore` — the default ignores, additional globs and the `.gitignore` slice.
2. `core` — the base ESLint rules, globals and `eslint-plugin-n` rules.
3. `imports` — the `import-x` setup, warnings, static analysis and optional stylistic/typescript/astro/markdown slices.

The meta-package does not use the factory: it composes the raw `ignore`, `core` and `imports` functions so it can interleave the feature packages in the historical order.

## Independence

The package must stay publishable standalone: it owns its dependencies (`eslint-config-flat-gitignore`, `eslint-flat-config-utils`, `eslint-import-resolver-typescript`, `eslint-plugin-import-x`, `eslint-plugin-n`, `eslint-plugin-simple-import-sort`, `eslint-plugin-unused-imports`, `globals`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration).

## Dependency versions

See [Feature packages](../../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`coreFactory()` accepts an optional options object (`CoreFactoryOptions`) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import core from '@hexadrop/eslint-config-core';

export default core({ markdown: true, typescript: true });
```

Every feature package imports the universal globs and its config names from this package, which is a regular dependency of them all.

## Generated types

`scripts/typegen.ts` resolves the package pipeline with every optional section enabled and writes `src/typegen.d.ts` (git-ignored), so `RuleOptions` and `ConfigNames` cover the whole pipeline. See [Development](development.md) for when to regenerate it.
