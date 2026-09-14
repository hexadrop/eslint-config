# Architecture

`astroConfig()` composes the package's ESLint v9 flat configuration for Astro files so consumers can use the astro slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                         | Responsibility                                                                                                                                    |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`               | Exports the default `astroFactory()` factory and the named `config`, `GLOB_ASTRO`, `GLOB_ASTRO_JAVASCRIPT`, `GLOB_ASTRO_TYPESCRIPT`, and config name exports. |
| `src/astro.config.ts`        | Defines the astro slice: eslint-plugin-astro, astro-eslint-parser, and @typescript-eslint/parser. Auto-detects typescript support.                  |
| `src/astro.factory.ts`       | `astroFactory(options?, ...configs)` returns a `FlatConfigComposer` wrapping `astroConfig()`.                                                     |
| `src/astro.typed-config.ts`  | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`.                              |
| `scripts/typegen.ts`         | Generates typed rules and configuration names.                                                                                                    |

## Independence

The package must stay publishable standalone: it owns its dependencies (`eslint-plugin-astro`, `astro-eslint-parser`, `@typescript-eslint/parser`, `eslint-flat-config-utils`, `globals`, `local-pkg`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration). The local `TypedFlatConfigItem` is a one-line alias binding the shared generic to this package's generated `RuleOptions`.

## Typescript peer detection

`@hexadrop/eslint-config-typescript` is an **optional peer** (`peerDependenciesMeta: { optional: true }`). Detection uses `isPackageExists('@hexadrop/eslint-config-typescript')` from `local-pkg`:

- **Present** → TS-in-astro parsing activates (`@typescript-eslint/parser` is loaded), TS script files inside `.astro` are linted.
- **Absent** → JavaScript-only mode, no TS parsing or TS script linting.
- **Explicit `typescript: true` + missing peer** → throws a descriptive install error.

## Dependency versions

See [Feature packages](../../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`astroFactory()` accepts an optional options object (`AstroConfigOptions`, defaults to auto-detect) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import astro from '@hexadrop/eslint-config-astro';

export default astro({ typescript: false });
```

## Generated types

`scripts/typegen.ts` resolves the package pipeline and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
