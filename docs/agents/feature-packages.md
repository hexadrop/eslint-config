# Feature packages

The monorepo splits the config into granular feature packages under `packages/`. Every feature package follows the same conventions; this guide is the single source of truth for them.

## The shared package

`@hexadrop/eslint-config-shared` (`packages/eslint-config-shared`) is **private — never published**. It holds what every feature package needs:

- Types: `Awaitable`, `Nullable`, `RecursivePartial`, and the generic `TypedFlatConfigItem<RuleOptionsType>`.
- Constants: `PLUGIN_PREFIX`.
- Utilities: `interopDefault`, `toArray`, `renameRules`, `pluginConfigRules`, `pluginConfigOverrideRules`.

### Consumption rules

- Import from the package name (`@hexadrop/eslint-config-shared`), never via relative paths across packages.
- **Do not declare it in `dependencies` or `devDependencies`.** It is resolved through the root `tsconfig.json` `paths` during development and type-checking, and the root `eslint.config.js` whitelists it for `import/no-extraneous-dependencies`.
- Add `noExternal: ['@hexadrop/eslint-config-shared']` to the package's `tsdown.config.ts` so the code is inlined into the published bundle. It must never appear as a runtime dependency of any published package.
- Each package keeps a local `TypedFlatConfigItem` alias binding the shared generic to its own generated `RuleOptions`:

  ```ts
  import type { TypedFlatConfigItem as TypedFlatConfigItemShared } from '@hexadrop/eslint-config-shared';

  import type { RuleOptions } from '../typegen';

  export type TypedFlatConfigItem = TypedFlatConfigItemShared<RuleOptions>;
  ```

## Independence

Each feature package must stay publishable standalone: it owns its plugin/parser dependencies and never imports from `@hexadrop/eslint-config` source files — only from `@hexadrop/eslint-config-shared`.

## Dependency versions

Cross-package dependencies between **publishable** packages use pinned semver (e.g. `"@hexadrop/eslint-config-json": "1.0.11"` in the meta-package), never the `workspace:` protocol — changesets does not replace bare `workspace:*` ranges in published tarballs (only `workspace:^`/`~`/explicit ranges). Bun resolves the semver range against the local workspace automatically during development.

## Generated types

Each package generates its own `src/typegen.d.ts` (git-ignored via `packages/*/src/typegen.d.ts`) from its own pipeline with `eslint-typegen`. Never commit it; the `prepare` script regenerates it on `bun install`.
