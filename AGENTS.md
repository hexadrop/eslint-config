# Copilot instructions for @hexadrop/eslint-config

A Bun workspaces monorepo. The published package lives at `packages/eslint-config` and other feature packages may be added under `packages/*` as the issue series progresses.

- **Package manager:** Bun (`bun`)
- **Build:** `bun run --filter @hexadrop/eslint-config build`
- **Test:** `bun run test`
- **Type-check:** `bun run typecheck`
- **Lint:** `bun run lint:fix`

For editing the published config, go to `packages/eslint-config/` and operate from there. Shared root tasks (PRs, branches, changesets, commits) are at the repo root.

## Task guides

- [Architecture](packages/eslint-config/docs/agents/architecture.md) — composition pipeline.
- [Development](packages/eslint-config/docs/agents/development.md) — targeted validation.
- [Release process](docs/agents/release-process.md) — changesets, beta snapshots, stable releases, and hotfixes.
- [Pull requests](docs/agents/pull-requests.md) — approved-issue, labeling, checklist, and merge requirements.
- [Branches and commits](docs/agents/branches-and-commits.md) — GitFlow branches, naming, conventions, and hooks.
