# Architecture

`reactConfig()` composes the package's ESLint v9 flat configuration for React files so consumers can use the react slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                          | Responsibility                                                                                                       |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                | Exports the default `reactFactory()` and the named exports (globs, config names, options type).                      |
| `src/react.config.ts`         | Defines the react slice: `eslint-plugin-react`, `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.       |
| `src/react.globs.ts`          | Stores the file globs the slice targets (`GLOB_REACT_JSX`, `GLOB_REACT_TSX`).                                        |
| `src/react.config-name.ts`    | Stores the config names of the react slice.                                                                          |
| `src/react.typed-config.ts`   | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`. |
| `scripts/typegen.ts`          | Generates typed rules and configuration names.                                                                       |

## Optional typescript peer

`@hexadrop/eslint-config-typescript` is an **optional peer dependency** (`peerDependenciesMeta.optional: true`). The flavor is resolved per run:

1. `typescript: true` — the typescript flavor is required; when the peer is missing the config throws an actionable install error instead of silently degrading. Integrators that own the typescript concern themselves (the `@hexadrop/eslint-config` meta-package) opt out of the check with the internal `peerCheck: false` option.
2. `typescript: false` — the js flavor is forced, even when the peer is installed.
3. `typescript: undefined` (default) — presence detection via `local-pkg`'s `isPackageExists()` decides: the typescript flavor activates automatically when the peer is installed.

The typescript flavor extends the targeted files with the tsx globs and drops the js-only guards (`react/jsx-no-undef`, `react/prop-types`) because the typescript compiler already covers them.

## Independence

The package must stay publishable standalone: it owns its dependencies (`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-flat-config-utils`, `local-pkg`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration). The local `TypedFlatConfigItem` is a one-line alias binding the shared generic to this package's generated `RuleOptions`.

## Dependency versions

See [Feature packages](../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`reactFactory()` accepts an optional options object (`{ react, typescript }`, defaults `true` / detected) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import hexadropReact from '@hexadrop/eslint-config-react';

export default hexadropReact();
```

Named exports:

| Export                                                                                            | Description                                       |
|---------------------------------------------------------------------------------------------------|---------------------------------------------------|
| `react`                                                                                           | The raw react config function the factory composes. |
| `HexadropEslintReactOptions`                                                                      | The factory options type.                         |
| `GLOB_REACT_JSX` / `GLOB_REACT_TSX`                                                               | The jsx and tsx file globs.                       |
| `REACT_CONFIG_NAME_SETUP` / `REACT_CONFIG_NAME_RULES` / `REACT_CONFIG_NAME_RULES_HOOKS` / `REACT_CONFIG_NAME_RULES_REFRESH` | Config names of the react slice. |

## Generated types

`scripts/typegen.ts` resolves the package's config pipeline and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
