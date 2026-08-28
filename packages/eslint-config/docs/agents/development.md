# Development and testing

Use the smallest command that validates the changed behavior.

## Commands

| Task | Command |
| --- | --- |
| Install dependencies | `bun install` |
| Run all unit tests | `bun run test` |
| Run tests for one package | `bun test packages/<name>` |
| Run tests for one file | `bun test packages/<name>/src/<file>.test.ts` |
| Lint and fix | `bun run lint:fix` |
| Type-check | `cd packages/eslint-config && bun run typecheck` |
| Build one package | `bun run build` (delegates to `bun run --filter @hexadrop/eslint-config build`) |

## Working on `packages/eslint-config`

When rules, plugins, or config names change, follow the same rule/plugin guidelines as before but from inside `packages/eslint-config/`:

1. Update `src/config/<concern>/<concern>.config.ts`.
2. Regenerate with the package's own `bun run build:types` (called from its package dir).
3. Run `bun run lint` and `bun run typecheck`.
4. Golden tests under `packages/eslint-config/test/golden/` and e2e snapshots under `packages/eslint-config/e2e/__snapshots__` guard the resolved config byte-for-byte.

## Typegen

`packages/eslint-config/scripts/typegen.ts` writes `packages/eslint-config/src/generated.d.ts` (git-ignored). The generated name is stable regardless of the package's location, unlike the historical `typegen.d.ts` which embedded itself into gitignore ignore globs and flipped locations over time.

Golden snapshot files keep the current absolute-prefix (`packages/eslint-config/src/typegen.d.ts`) until the generation logic changes; the e2e snapshot under `packages/eslint-config/e2e/__snapshots__` captures `eslint --fix` output against real fixture files.
