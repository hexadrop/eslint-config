# Development and testing

## Working on `packages/eslint-config`

When rules, plugins, or config names change:

1. Update the owning package: `packages/eslint-config-core/` for base rules, ignores and imports; `packages/eslint-config-<feature>/` for a framework concern.
2. Regenerate types with `bun run --filter @hexadrop/eslint-config build:types`.
3. Run `bun run lint` and `bun run typecheck` from the root.
4. E2E snapshots under `packages/eslint-config/e2e/__snapshots__` guard the resolved behavior against real fixture files.

## Typegen

`packages/eslint-config/scripts/typegen.ts` writes `packages/eslint-config/src/typegen.d.ts` (git-ignored). The generated name is stable regardless of the package's location, unlike the historical `typegen.d.ts` which embedded itself into gitignore ignore globs and flipped locations over time.

The e2e snapshot under `packages/eslint-config/e2e/__snapshots__` captures `eslint --fix` output against real fixture files.
