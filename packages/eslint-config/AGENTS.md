# @hexadrop/eslint-config agent guide

Shared ESLint configuration exposed through the monorepo workspace.

- **Package manager:** Bun (`bun`)
- **Build:** `cd packages/eslint-config && bun run build` (or `bun run --filter @hexadrop/eslint-config build` from the root)
- **Test:** `bun test packages/eslint-config` (or `bun run test` at root)
- **Type-check:** `cd packages/eslint-config && bun run typecheck` (or `bun run typecheck` at root)
- **Lint:** `cd packages/eslint-config && bun run lint:fix` (or root's `lint`/`lint:fix` scripts)

## Task guides

- [Architecture](docs/agents/architecture.md) — pipeline composition and generated types.
- [Development](docs/agents/development.md) — targeted validation commands.

Top-level workflow rules (branches, commits, PR rules) live in the root [AGENTS.md](../../AGENTS.md).
