# Conventions

## File organization

- Each config concern lives in `src/config/<concern>/` with:
  - `<concern>.config.ts` — main config function
  - `<concern>.config-name.ts` — named constants for `name` fields
  - `<concern>.globs.ts` — file globs
  - `index.ts` — re-export
- `src/options` contains option interfaces and the default-options resolver
- `src/utils` contains small helpers: `combine`, `interopDefault`, `pluginConfigRules`, `renameRules`, `extractTypedFlatConfigItem`, etc.
- `src/const` contains plugin rename maps

## Config names

Every config object must have a `name`. Names follow the pattern `hexadrop/<concern>/<purpose>` (e.g. `hexadrop/typescript/rules`, `hexadrop/stylistic/rules/prettier`). These names are referenced by `FlatConfigComposer` for overrides and appear in `ConfigNames`.

## `TypedFlatConfigItem`

Defined in `src/types/typed-flat-config-item.ts`, it is an ESLint `Linter.Config` whose `rules` are typed against the generated `RuleOptions`. Use it when adding new config objects so rules are type-checked.

## `interopDefault`

Always use the `interopDefault` helper when dynamically importing plugins to handle both ESM default and CommonJS exports safely:

```ts
const plugin = await interopDefault(import('some-plugin'));
```

## Import plugin notes

- Uses `eslint-plugin-import-x` but exposes it as `import/*`
- TypeScript resolver is `eslint-import-resolver-typescript`
- Node resolver is from `eslint-plugin-import-x`
- Unused imports are handled by `eslint-plugin-unused-imports` (exposed as `import-unused/*`)
- Import sorting is handled by `eslint-plugin-simple-import-sort` (exposed as `import-sort/*`)
