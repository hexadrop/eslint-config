# @hexadrop/eslint-config-shared agent guide

Internal shared types, constants and utilities for the `@hexadrop/eslint-config` feature packages.

**Private package — never published.** Feature packages import it as `@hexadrop/eslint-config-shared` and bundle it into their `dist/` via tsdown `noExternal`, so it never appears as a runtime dependency of any published package.

- **Package manager:** Bun (`bun`)
- **Type-check:** `bun run typecheck` (at root)
- **Lint:** `bun run lint:fix` (at root)

## What lives here

| Area | Contents |
| --- | --- |
| `src/types/` | Pure types: `Awaitable`, `Nullable`, `RecursivePartial`. |
| `src/const/` | `PLUGIN_PREFIX` (`'hexadrop'`). |
| `src/utils/` | `interopDefault`, `toArray`, `renameRules`, `pluginConfigRules`, `pluginConfigOverrideRules`. |

## What does NOT live here

- **`TypedFlatConfigItem`** — each package types it against its own generated `RuleOptions`; keep it local per package.
- **Globs and config names** — owned by each feature package's public interface.
- **Generated typegen files** — per package by design.

## Consumption rules

- Import from the package name (`@hexadrop/eslint-config-shared`), never via relative paths across packages.
- Consumers declare it in `devDependencies` with the pinned version `0.0.0` (never `workspace:*` — changesets does not rewrite the bare protocol in published tarballs) and resolve the source through the root `tsconfig.json` `paths`.
- Consumers add `noExternal: ['@hexadrop/eslint-config-shared']` to their `tsdown.config.ts` so the code is inlined into their bundle.
