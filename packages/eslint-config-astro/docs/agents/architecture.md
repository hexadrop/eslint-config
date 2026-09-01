# Architecture

`astroConfig()` composes the package's ESLint v9 flat configuration for Astro files so consumers can use the astro slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                          | Responsibility                                                                                                       |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                | Exports the default `astroFactory()` and the named exports (globs, config names, options type).                      |
| `src/astro.config.ts`         | Defines the astro slice: `eslint-plugin-astro` and `astro-eslint-parser`.                                            |
| `src/astro.globs.ts`          | Stores the file globs the slice targets (`GLOB_ASTRO`, `GLOB_ASTRO_JAVASCRIPT`, `GLOB_ASTRO_TYPESCRIPT`).            |
| `src/astro.config-name.ts`    | Stores the config names of the astro slice.                                                                          |
| `src/astro.typed-config.ts`   | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`. |
| `scripts/typegen.ts`          | Generates typed rules and configuration names.                                                                       |

## Optional typescript peer

`@hexadrop/eslint-config-typescript` is an **optional peer dependency** (`peerDependenciesMeta.optional: true`). The typescript parsing path is resolved per run:

1. `typescript: true` — TS-in-astro parsing activates; when the peer is missing the config throws an actionable install error instead of silently degrading. Integrators that own the typescript concern themselves (the `@hexadrop/eslint-config` meta-package) opt out of the check with the internal `peerCheck: false` option.
2. `typescript: false` — JS-only parsing is forced, even when the peer is installed.
3. `typescript: undefined` (default) — presence detection via `local-pkg`'s `isPackageExists()` decides: TS-in-astro parsing activates automatically when the peer is installed.

When the typescript flavor is active the parser uses `@typescript-eslint/parser` and the processor becomes `astro/client-side-ts`; otherwise only `astro-eslint-parser` is used with the `astro/astro` processor.

## Independence

The package must stay publishable standalone: it owns its dependencies (`eslint-plugin-astro`, `astro-eslint-parser`, `eslint-flat-config-utils`, `local-pkg`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration). The local `TypedFlatConfigItem` is a one-line alias binding the shared generic to this package's generated `RuleOptions`.

## Dependency versions

See [Feature packages](../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`astroFactory()` accepts an optional options object (`{ astro, typescript }`, defaults `true` / detected) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import hexadropAstro from '@hexadrop/eslint-config-astro';

export default hexadropAstro();
```

Named exports:

| Export                                                                                                                            | Description                                       |
|-----------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| `astro`                                                                                                                           | The raw astro config function the factory composes. |
| `HexadropEslintAstroOptions`                                                                                                      | The factory options type.                         |
| `GLOB_ASTRO` / `GLOB_ASTRO_JAVASCRIPT` / `GLOB_ASTRO_TYPESCRIPT`                                                                  | The `.astro` file globs and their inline script globs. |
| `ASTRO_CONFIG_NAME_RULES` / `ASTRO_CONFIG_NAME_SETUP` / `ASTRO_CONFIG_NAME_SETUP_PARSER` / `ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT` / `ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT` | Config names of the astro slice. |

## Generated types

`scripts/typegen.ts` resolves the package's config pipeline and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
