# Git & release workflow

## Release workflow

The project uses **Changesets** and GitFlow:

- Work happens on `feature/*` branches merged into `develop`.
- Add a changeset for any package behavior change: `bun changeset add`.
- `release-prepare.yml` creates/updates a release PR from `develop` to `main`.
- Merging the release PR into `main` publishes to npm under `latest`.
- `sync-to-develop.yml` opens a PR to sync `main` back into `develop`.
- Beta snapshots are published from `develop` when changesets exist.

## Commit and branch conventions

- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `perf`, `test`, `build`, `ci`, `revert`)
- **Branch names:** `<type>/<short-description>` in lowercase with hyphens/underscores/dots
- **PRs:** Must reference an approved issue (`Closes #N`) and have exactly one `type:*` label

## Husky / git hooks

- `pre-commit`: runs `bun lint-staged` (lints and auto-fixes all staged files)
- `pre-push`: not configured by default
- `commit-msg`: validates commit messages via commitlint
