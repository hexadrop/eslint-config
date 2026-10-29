# Architecture

`reactConfig()` composes the package's ESLint v9 flat configuration for React files so consumers can use the react slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                           | Responsibility                                                                                                                                    |
|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                 | Exports the default `reactFactory()` factory and the named `config` export.                                                                       |
| `src/react.config.ts`           | Defines the react slice: react, react-hooks, and react-refresh plugins and rules. Auto-detects typescript support.                                 |
| `src/react.factory.ts`         | `reactFactory(options?, ...configs)` returns a `FlatConfigComposer` wrapping `reactConfig()`.                                                     |
| `src/react.typed-config.ts`    | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`.                              |
| `scripts/typegen.ts`           | Generates typed rules and configuration names.                                                                                                    |

## Independence

The package must stay publishable standalone: it owns its dependencies (`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-flat-config-utils`, `local-pkg`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration). The local `TypedFlatConfigItem` is a one-line alias binding the shared generic to this package's generated `RuleOptions`.

## Typescript peer detection

`@hexadrop/eslint-config-typescript` is an **optional peer** (`peerDependenciesMeta: { optional: true }`). Detection uses `isPackageExists('@hexadrop/eslint-config-typescript')` from `local-pkg`:

- **Present** → TSX files are included and TS-specific rules are active (`react/jsx-no-undef` and `react/prop-types` are excluded).
- **Absent** → JSX-only mode, no TSX files or TS-specific rules.
- **Explicit `typescript: true` + missing peer** → throws a descriptive install error.

## Dependency versions

See [Feature packages](../../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`reactFactory()` accepts an optional options object (`ReactConfigOptions`, defaults to auto-detect) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import react from '@hexadrop/eslint-config-react';

export default react({ typescript: false });
```

## Generated types

`scripts/typegen.ts` resolves the package pipeline and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
