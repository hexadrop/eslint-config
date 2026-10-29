# Architecture

`stylisticConfig()` composes the package's ESLint v9 flat configuration for the stylistic concern, so consumers can use the stylistic slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                              | Responsibility                                                                                                                                            |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                    | Exports the default `stylisticFactory()` factory, the named `config` export, and the option types.                                                       |
| `src/stylistic.config.ts`         | Defines the stylistic slice: `@stylistic` rules plus the optional typescript, json, astro, unicorn, perfectionist, prettier and markdown sections.        |
| `src/stylistic.factory.ts`        | `stylisticFactory(options?, ...configs)` returns a `FlatConfigComposer` wrapping `stylisticConfig()`.                                                      |
| `src/stylistic.resolve-options.ts`| Fills the option defaults and resolves the optional peers through `local-pkg`.                                                                            |
| `src/stylistic.options.ts`        | Public option types: `StylisticFactoryOptions` and `HexadropEslintStylisticOptions`.                                                                       |
| `src/stylistic.typed-config.ts`   | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`.                                      |
| `scripts/typegen.ts`              | Generates typed rules and configuration names.                                                                                                            |

## Sections

`stylisticConfig()` emits its config items in this order:

1. `setup` — registers the `style` plugin and, conditionally, `unicorn`, `perfectionist` and `format`.
2. `rules` — the base `@stylistic` ruleset.
3. `rules/markdown/source` — markdown code-block overrides.
4. `rules/typescript`, `rules/typescript/type-aware`, `rules/typescript/dts` — TypeScript stylistic rules.
5. `rules/json` and the `package.json`/`tsconfig.json` sort-keys items.
6. `rules/astro` — astro-specific stylistic rules.
7. `rules/unicorn` and its markdown variants.
8. `rules/perfectionist`.
9. `rules/prettier` and its astro/markdown variants.
10. `rules/markdown/json` and `rules/markdown/astro` indentation overrides.

## Optional peer detection

`resolveOptions()` resolves `typescript`, `astro` and `json` with `isPackageExists` from `local-pkg`:

- **Omitted** → enabled when the sibling package is installed.
- **`true`** → forced on; throws an actionable install error when the peer is missing.
- **`false`** → forced off.

The meta-package always passes explicit booleans (its own resolved options), so its behavior is unchanged; the detection only matters when the factory is consumed standalone.

`@typescript-eslint/eslint-plugin` is an optional peer: the typescript section imports it, and it is only required when `@hexadrop/eslint-config-typescript` is installed.

## The json dependency

`@hexadrop/eslint-config-json` is a regular dependency because the `package.json`/`tsconfig.json` sort-keys slice lives there and is composed into the json section.

The module is imported dynamically inside `stylisticConfig()` (only when `json` is enabled) instead of statically at the top of the module: the meta-package imports `-json` dynamically too, and loading both concurrently through jiti (the repo's TypeScript config loader) resolves one of them to a partially-initialized module.

## Independence

The package must stay publishable standalone: it owns its dependencies (`@stylistic/eslint-plugin`, `eslint-plugin-unicorn`, `eslint-plugin-perfectionist`, `eslint-plugin-format`, `prettier`, `prettier-plugin-astro`, `eslint-flat-config-utils`, `local-pkg`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration).

## Dependency versions

See [Feature packages](../../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`stylisticFactory()` accepts an optional options object (`StylisticFactoryOptions`, defaults to auto-detect) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import stylistic from '@hexadrop/eslint-config-stylistic';

export default stylistic({ markdown: true, typescript: true });
```

## Generated types

`scripts/typegen.ts` resolves the package pipeline with every optional section enabled and writes `src/typegen.d.ts` (git-ignored), so `RuleOptions` and `ConfigNames` cover the whole peer matrix. See [Development](development.md) for when to regenerate it.
