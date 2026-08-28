# @hexadrop/eslint-config agent guide

Shared ESLint configuration exposed through the monorepo workspace.

- **Package manager:** Bun (`bun`)
- **Build:** `cd packages/eslint-config && bun run build` (or `bun run build` at root, which forwards to the package's `build` script)
- **Test:** `bun test packages/eslint-config` (or `bun run test` at root)
- **Type-check:** `cd packages/eslint-config && bun run typecheck`
- **Lint:** `cd packages/eslint-config && bun run lint:fix` (or root's `lint`/`lint:fix` scripts)

## Task guides

- [Architecture](docs/agents/architecture.md) — pipeline composition and generated types.
- [Development](docs/agents/development.md) — targeted validation commands.

Top-level workflow rules (branches, commits, PR rules) live in the root [AGENTS.md](../../AGENTS.md).
