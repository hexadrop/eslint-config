# @hexadrop/eslint-config-shared agent guide

Internal shared types, constants and utilities for the `@hexadrop/eslint-config` feature packages.

**Private package — never published.** Feature packages import it as `@hexadrop/eslint-config-shared` and bundle it into their `dist/` via tsdown `deps.alwaysBundle`, so it never appears as a runtime dependency of any published package.

- **Package manager:** Bun (`bun`)
- **Type-check:** `bun run typecheck` (at root)
- **Lint:** `bun run lint:fix` (at root)

## What lives here

| Area | Contents |
| --- | --- |
| `src/types/` | Pure types: `Awaitable`, `Nullable`, `RecursivePartial`, and the generic `TypedFlatConfigItem<RuleOptionsType>`. |
| `src/const/` | `PLUGIN_PREFIX` (`'hexadrop'`). |
| `src/utils/` | `interopDefault`, `toArray`, `renameRules`, `pluginConfigRules`, `pluginConfigOverrideRules`. |

## What does NOT live here

- **Per-package rule typings** — each package keeps a local `TypedFlatConfigItem` alias binding the shared generic to its own generated `RuleOptions`.
- **Globs and config names** — owned by each feature package's public interface.
- **Generated typegen files** — per package by design.

## Consumption rules

See [Feature packages](../../../docs/agents/feature-packages.md): import by package name, resolve via the root `tsconfig.json` `paths`, never declare it in a manifest (the root `eslint.config.js` whitelists it for `import/no-extraneous-dependencies`), and bundle it via tsdown `deps.alwaysBundle`.
