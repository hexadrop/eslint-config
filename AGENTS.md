# Copilot instructions for @hexadrop/eslint-config

A Bun workspaces monorepo. The monorepo publishes the zero-config meta-package at `packages/eslint-config` plus the core and feature packages under `packages/*`.

See the [repository README](README.md) for the granular packages and [Architecture](docs/agents/architecture.md) for the package graph.

- **Package manager:** Bun (`bun`)
- **Build:** `bun run build`
- **Test:** `bun run test`
- **Type-check:** `bun run typecheck`
- **Lint:** `bun run lint:fix`

For editing a concern, go to its package under `packages/`; the meta-package only resolves options, autodetects frameworks and composes. Shared root tasks (PRs, branches, changesets, commits) are at the repo root.

## Task guides

- [Architecture](docs/agents/architecture.md) — package graph, composition order and typegen.
- [Development](docs/agents/development.md) — targeted validation.
- [Feature packages](docs/agents/feature-packages.md) — shared package, independence and dependency-version rules every `packages/*` feature package follows.
- [Release process](docs/agents/release-process.md) — changesets, beta snapshots, stable releases, and hotfixes.
- [Pull requests](docs/agents/pull-requests.md) — approved-issue, labeling, checklist, and merge requirements.
- [Branches and commits](docs/agents/branches-and-commits.md) — GitFlow branches, naming, conventions, and hooks.
