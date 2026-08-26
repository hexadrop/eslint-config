# Git & release workflow

## Branches

This project uses GitFlow with Changesets for versioning and npm publication.

| Branch      | Purpose                                                      | Publication                    |
|-------------|--------------------------------------------------------------|--------------------------------|
| `feature/*` | Product and maintenance work                                 | None                           |
| `develop`   | Integration branch for the next release                      | Beta snapshot tagged `beta`    |
| `release/*` | Optional release stabilization branch created from `develop` | None                           |
| `main`      | Stable, production-ready releases                            | Stable release tagged `latest` |
| `hotfix/*`  | Urgent fix created from `main`                               | None                           |

## Commit and branch conventions

- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `perf`, `test`, `build`, `ci`, `revert`)
- **Branch names:** `<type>/<short-description>` in lowercase with hyphens/underscores/dots
- **PRs:** Must reference an approved issue (`Closes #N`) and have exactly one `type:*` label

### Branch name pattern

```
^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert|release|hotfix)\/[a-z0-9._-]+$
```

## Automated workflows

| Workflow                                | Trigger                                  | Responsibility                                                 |
|-----------------------------------------|------------------------------------------|----------------------------------------------------------------|
| `.github/workflows/ci.yml`              | Push/PR to `main` or `develop`           | Runs lint and typecheck via the reusable `check.yml`           |
| `.github/workflows/check.yml`           | Reused by other workflows                | Installs dependencies and runs `lint:ci` and `typecheck`       |
| `.github/workflows/release-prepare.yml` | Push to `develop`                        | Creates or updates the draft release PR to `main`              |
| `.github/workflows/release.yml`         | Push to `main`                           | Publishes the stable package to npm under the `latest` tag     |
| `.github/workflows/release-beta.yml`    | Push to `develop` with changeset changes | Publishes a beta snapshot to npm under the `beta` tag          |
| `.github/workflows/sync-to-develop.yml` | Merge of any PR into `main`              | Opens/updates the sync PR `internal/sync-from-main-to-develop` |

## Merge methods per pull request

Use the merge method that keeps the history of `main` and `develop` aligned:

| Pull request                        | Branches                                         | Merge method     | Rationale                                                                                                           |
|-------------------------------------|--------------------------------------------------|------------------|---------------------------------------------------------------------------------------------------------------------|
| Feature, fix, chore, docs, renovate | `feature/*`, `fix/*`, `renovate/*` → `develop`   | **Squash merge** | Individual work branches produce one clean commit; `develop` keeps a linear history.                                |
| Hotfix                              | `hotfix/*` → `main`                              | **Squash merge** | The branch comes from `main`; one commit is enough and keeps `main` linear.                                         |
| Release                             | `changeset-release/main` → `main`                | **Merge commit** | Lets `main` absorb the full commit history from `develop`, keeping both branches aligned and preventing divergence. |
| Sync                                | `internal/sync-from-main-to-develop` → `develop` | **Merge commit** | Pulls the released `main` history back into `develop` without losing ancestry.                                      |

Rule of thumb:

- **Squash merge** when the source branch is a short-lived work branch whose history does not need to survive.
- **Merge commit** when the source branch is `main` or `develop`, so both branches share ancestry and future pull requests stay small.

## Daily development

1. Create a `feature/*` branch from `develop`.
2. Add a changeset for every package behavior change with `bun changeset add`.
3. Open and merge the pull request into `develop`.
4. After CI passes, each push to `develop` that adds or modifies a changeset publishes a unique beta version to npm under the `beta` dist-tag.

Install the current beta explicitly when testing it:

```bash
npm install eslint-config@beta
```

Snapshot releases do not modify or commit version files. They use the pending changesets to calculate a version such as `0.2.0-beta-20260802153000`. Documentation, tooling, and other changes without a changeset do not publish a beta.

## Stable release

1. When `develop` contains non-empty changesets, `release-prepare.yml` creates or updates the draft `changeset-release/main` pull request targeting `main`.
2. Validate the current beta. When it is ready, mark the generated release pull request ready for review and merge it into `main`.
3. `release.yml` on `main` publishes the stable package to npm under the `latest` dist-tag.
4. `sync-to-develop.yml` opens or rebases the automated pull request `internal/sync-from-main-to-develop → develop`. **Merge it with a merge commit** to synchronize the generated changelog, package version, and consumed changesets while keeping the full history of `main`.

The generated release pull request contains the pending changes, calculated stable version, changelog entry, and consumed changesets. Changesets release pull requests and their version commits use `chore: release v<version>`. They do not publish packages; publication remains exclusive to `main`.

## Release stabilization

Use a `release/*` branch only when a release needs a stabilization period. It freezes the release scope while new work continues on `develop`; do not merge the automatically generated release pull request while that stabilization is in progress.

1. Create `release/<version>` from `develop`.
2. Allow only release-critical fixes, documentation updates, and QA changes on the release branch.
3. Merge the release branch into `main` when it is approved.
4. `release-prepare.yml` opens the version pull request on `main`; merge it to publish the stable package.
5. Merge the `internal/sync-from-main-to-develop` pull request from `main` to `develop` so the stabilization fixes and generated release files return to the integration branch.

GitHub Actions must be allowed to create pull requests for the automated release and sync workflows to work.

The `internal:sync` label exempts automated branch synchronization pull requests from issue and type validation. They must not include changeset files.

## Hotfixes

For an urgent production fix, create `hotfix/*` from `main`, include a changeset, merge it into `main`, then merge the resulting `internal/sync-from-main-to-develop` pull request into `develop`.

## Husky / git hooks

- `pre-commit`: runs `bun lint-staged` (lints and auto-fixes all staged files)
- `pre-push`: not configured by default
- `commit-msg`: validates commit messages via commitlint
