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
- Add `deps: { alwaysBundle: ['@hexadrop/eslint-config-shared'] }` to the package's `tsdown.config.ts` so the code is inlined into the published bundle. It must never appear as a runtime dependency of any published package.
- Each package keeps a local `TypedFlatConfigItem` alias, colocated with its config files as `src/<feature>.typed-config.ts`, binding the shared generic to its own generated `RuleOptions`:

  ```ts
  import type { TypedFlatConfigItem as TypedFlatConfigItemShared } from '@hexadrop/eslint-config-shared';

  import type { RuleOptions } from './typegen';

  export type TypedFlatConfigItem = TypedFlatConfigItemShared<RuleOptions>;
  ```

## Independence

Each feature package must stay publishable standalone: it owns its plugin/parser dependencies and never imports from `@hexadrop/eslint-config` source files — only from `@hexadrop/eslint-config-shared`.

## Dependency versions

Cross-package dependencies between **publishable** packages use pinned semver (e.g. `"@hexadrop/eslint-config-json": "1.0.11"` in the meta-package), never the `workspace:` protocol — changesets does not replace bare `workspace:*` ranges in published tarballs (only `workspace:^`/`~`/explicit ranges).

## Local development resolution

The root `tsconfig.json` `paths` maps **every** package name to its `src/` entry — every package except the `@hexadrop/eslint-config` meta-package itself, which must always be imported via relative paths inside this repo (its own `prepare` typegen cannot resolve itself through `paths` on a clean install).

- Bun reads `tsconfig.json` `paths` at runtime, and `tsc` reads it at type-check time, so the local sources are always used during development regardless of build state.
- This is what makes a clean `bun install` work: the meta-package's `prepare` typegen imports `@hexadrop/eslint-config-json` before any `dist/` exists, and `paths` resolves it to the source.
- When adding a new feature package, add its `paths` entry following the existing pattern (`name` → `src/index.ts`, `name/*` → `src/*`).
- Publishing is unaffected: consumers resolve the semver range against the published `dist/`, and tsdown builds each package from its own source.

## Local imports

Inside a feature package, always import own sources with plain relative paths (`./` within `src/`, `../src/` from `test/`, `e2e/` and `scripts/`) — no path aliases. This keeps the packages free of per-package `tsconfig.json` files: the root `tsconfig.json` only maps package **names** (for cross-package imports), and everything inside a package resolves without extra configuration. Cross-package imports still use the package name (`@hexadrop/eslint-config-shared`), never relative paths across packages.

## The `development` export condition

Each feature package's `exports` map carries a `development` condition pointing at `src/index.ts`, above `types` and `default`:

```json filename="exports.json"
{
  "exports": {
    ".": {
      "development": "./src/index.ts",
      "types": "./dist/index.d.mts",
      "default": "./dist/index.mjs"
    }
  }
}
```

- Bun activates the `development` condition by default; Node (and ESLint running on Node) activates it when the root scripts pass `NODE_OPTIONS='--conditions=development'` — the root `lint` / `lint:ci` / `lint:fix` scripts do exactly that, so linting the repo works without building any `dist/`.
- The repo's `eslint.config.js` imports the meta-package source via jiti, and jiti uses `require.resolve` under the hood — the `development` condition is what lets that resolution reach `src/` instead of a missing `dist/index.mjs`.
- Published consumers never activate the condition, so they keep resolving `types` + `default` against `dist/`. The condition line ships in the published manifest harmlessly.
- When adding a new feature package, copy this `exports` shape verbatim.

## Generated types

Each package generates its own `src/typegen.d.ts` (git-ignored via `packages/*/src/typegen.d.ts`) from its own pipeline with `eslint-typegen`. Never commit it; the `prepare` script regenerates it on `bun install`.
