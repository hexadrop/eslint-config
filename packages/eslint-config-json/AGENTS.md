# @hexadrop/eslint-config-json agent guide

The json slice of the shared ESLint configuration, publishable and usable standalone.

- **Package manager:** Bun (`bun`)
- **Build:** `bun run --filter @hexadrop/eslint-config-json build` (from the repo root)
- **Test:** `bun test packages/eslint-config-json` (or `bun run test` at root)
- **Type-check:** `bun run typecheck` (at root)
- **Lint:** `bun run lint:fix` (at root)

The package only keeps package-exclusive scripts (`build`, `build:types`, `prepublishOnly`); everything else runs from the repo root.

## Task guides

- [Architecture](docs/agents/architecture.md) — package composition and generated types.
- [Development](docs/agents/development.md) — targeted validation commands.

Top-level workflow rules (branches, commits, PR rules) live in the root [AGENTS.md](../../AGENTS.md).
