# Conventions

Follow these conventions when extending the configuration so its modules, rule names, and generated types remain predictable.

## Module layout

Each concern belongs in `src/config/<concern>/`.

| File | Purpose |
| --- | --- |
| `<concern>.config.ts` | Exports the main configuration function. |
| `<concern>.config-name.ts` | Defines constants used as ESLint config `name` values. |
| `<concern>.globs.ts` | Defines file globs for the concern. |
| `index.ts` | Re-exports the concern's public members. |

Keep option interfaces and the default-options resolver in `src/options/`, shared helpers in `src/utils/`, and plugin-prefix mappings in `src/const/`.

## Named configurations

Every config object must set `name`. Use `hexadrop/<concern>/<purpose>`, such as `hexadrop/typescript/rules` or `hexadrop/stylistic/rules/prettier`.

These names are the stable handles that `FlatConfigComposer` uses for overrides and that generated `ConfigNames` exposes to consumers.

## Typed config items

Use `TypedFlatConfigItem` from `src/types/typed-flat-config-item.ts` for new configuration objects. It extends ESLint's `Linter.Config` with rules typed against generated `RuleOptions`.

## Plugin imports

Use `interopDefault` for every dynamically imported plugin. It supports both ESM default exports and CommonJS exports.

```ts
const plugin = await interopDefault(import('some-plugin'));
```

## Rule prefixes

Rules use normalized prefixes from `src/const/plugin-rename.ts`. Use the normalized name in config rules, inline disables, and consumer overrides.

| Use | Instead of |
| --- | --- |
| `style/*` | `@stylistic/*` |
| `typescript/*` | `@typescript-eslint/*` |
| `import/*` | `import-x/*` |
| `json/*` | `jsonc/*` |
| `node/*` | `n/*` |
| `import-sort/*` | `simple-import-sort/*` |
| `import-unused/*` | `unused-imports/*` |
| `test/*` | `vitest/*` |
| `yaml/*` | `yml/*` |

For example, use `typescript/consistent-type-definitions`, not `@typescript-eslint/consistent-type-definitions`.

## Import support

The import configuration uses `eslint-plugin-import-x`, exposing its rules as `import/*`. TypeScript resolution comes from `eslint-import-resolver-typescript`; Node resolution comes from `eslint-plugin-import-x`. Unused-import cleanup and sorting are exposed as `import-unused/*` and `import-sort/*` respectively.
