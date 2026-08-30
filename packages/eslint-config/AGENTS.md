# @hexadrop/eslint-config agent guide

Shared ESLint configuration exposed through the monorepo workspace.

- **Package manager:** Bun (`bun`)
- **Build:** `bun run --filter @hexadrop/eslint-config build` (from the repo root)
- **Test:** `bun test packages/eslint-config` (or `bun run test` at root)
- **Type-check:** `bun run typecheck` (at root)
- **Lint:** `bun run lint:fix` (at root)

The package only keeps package-exclusive scripts (`build`, `build:types`, `prepublishOnly`); everything else runs from the repo root.

## Task guides

- [Architecture](docs/agents/architecture.md) — pipeline composition and generated types.
- [Development](docs/agents/development.md) — targeted validation commands.

Top-level workflow rules (branches, commits, PR rules) live in the root [AGENTS.md](../../AGENTS.md).
