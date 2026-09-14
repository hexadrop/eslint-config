# Architecture

`jsonConfig()` composes the package's ESLint v9 flat configuration for JSON files so consumers can use the json slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                           | Responsibility                                                                                                                                    |
|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                 | Exports the default `jsonConfig()` factory and the named exports (globs, config names, sort-keys config).                                         |
| `src/json.config.ts`           | Defines the json slice: jsonc plugin, parser, and rules.                                                                                          |
| `src/json.sort-keys.ts`        | Defines the canonical key ordering for `package.json` and `tsconfig.json`.                                                                        |
| `src/json.globs.ts`            | Stores the file globs the slice targets.                                                                                                          |
| `src/json.config-name.ts`      | Stores the config names of the json slice.                                                                                                        |
| `src/json.typed-config.ts`     | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`.                              |
| `scripts/typegen.ts`           | Generates typed rules and configuration names.                                                                                                    |

## Independence

The package must stay publishable standalone: it owns its dependencies (`eslint-plugin-jsonc`, `jsonc-eslint-parser`, `eslint-flat-config-utils`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration). The local `TypedFlatConfigItem` is a one-line alias binding the shared generic to this package's generated `RuleOptions`.

## Dependency versions

See [Feature packages](../../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`jsonConfig()` accepts an optional options object (`{ json }`, default `true`) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import json from '@hexadrop/eslint-config-json';

export default json();
```

Named exports:

| Export                                                                                             | Description                                                                                     |
|----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `json`                                                                                             | The raw json config function the factory composes.                                              |
| `GLOB_JSON` / `GLOB_JSON_PACKAGE` / `GLOB_JSON_TSCONFIG`                                           | File globs the slice targets.                                                                   |
| `JSON_CONFIG_NAME_SETUP` / `JSON_CONFIG_NAME_SETUP_PARSER` / `JSON_CONFIG_NAME_RULES`              | Config names of the base json slice.                                                            |
| `JSON_SORT_KEYS_CONFIG`                                                                            | Canonical key ordering for `package.json` and `tsconfig.json`, ready to append to any pipeline. |
| `JSON_CONFIG_NAME_STYLISTIC_RULES_JSON_PACKAGE` / `JSON_CONFIG_NAME_STYLISTIC_RULES_JSON_TSCONFIG` | Config names of the sort-keys items.                                                            |

## Plugin prefix

The slice registers `eslint-plugin-jsonc` under the `json` prefix from the start (the meta-package renames `jsonc` → `json` when composing older sources). Rule keys are written with the final `json/` prefix.

## Generated types

`scripts/typegen.ts` resolves the package pipeline (base slice + sort-keys) and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
