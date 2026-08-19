# Contributing to @hexadrop/eslint-config

Thank you for your interest in contributing to **@hexadrop/eslint-config** — An opinionated linting configuration using
best practices and providing consistency to your code.

Before you dive in, please read this guide fully. We have a structured workflow to keep the project organized and maintainable.

---

## Table of Contents

- [Issue-First Workflow](#issue-first-workflow)
- [Label System](#label-system)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Commit Convention](#commit-convention)
- [Branching and Releases](#branching-and-releases)
- [Pull Request Rules](#pull-request-rules)
- [Code of Conduct](#code-of-conduct)

---

## Issue-First Workflow

**No PR without an issue. No exceptions.**

This project follows a strict issue-first workflow:

1. **Open an issue** using the appropriate template ([Bug Report](https://github.com/hexadrop/eslint-config/issues/new?template=bug_report.yml) or [Feature Request](https://github.com/hexadrop/eslint-config/issues/new?template=feature_request.yml))
2. **Wait for approval** — a maintainer will add the `status:approved` label when the issue is ready to be worked on
3. **Comment on the issue** to let others know you're working on it
4. **Open a PR** referencing the approved issue

PRs that are not linked to an approved issue will be **automatically rejected** by CI.

---

## Label System

### Type Labels (applied to PRs)

| Label                  | Description                             |
|------------------------|-----------------------------------------|
| `type:bug`             | Bug fix                                 |
| `type:feature`         | New feature or enhancement              |
| `type:docs`            | Documentation only                      |
| `type:refactor`        | Code refactoring, no functional changes |
| `type:chore`           | Build, CI, tooling changes              |

### Status Labels (applied to Issues)

| Label                 | Description                                     |
|-----------------------|-------------------------------------------------|
| `status:needs-review` | Newly opened, awaiting maintainer review        |
| `status:approved`     | Approved for implementation — work can begin    |
| `status:in-progress`  | Being worked on                                 |
| `status:blocked`      | Blocked by another issue or external dependency |
| `status:wont-fix`     | Out of scope or won't be addressed              |

### Priority Labels

| Label               | Description                               |
|---------------------|-------------------------------------------|
| `priority:critical` | Blocking issues, security vulnerabilities |
| `priority:high`     | Important, affects many users             |
| `priority:medium`   | Normal priority                           |
| `priority:low`      | Nice to have                              |

---

## Development Setup

### Prerequisites

- Node/Bun
- Git

### Clone and Build

```
git clone https://github.com/hexadrop/eslint-config.git
cd proxystudio.app
bun run build
```

### Run Locally

```bash
bun run dev
```

---

## Testing

### Unit Tests

Run the full unit test suite:

```bash
bun test
```

Run tests for a specific package:

```bash
bun test ./test/specific-file.test.ts
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

Commit messages **must** match this pattern:

```
^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+
```

### Format

```
<type>(<optional-scope>)!: <description>

[optional body]

[optional footer]
```

### Allowed Types

| Type       | Purpose                               |
|------------|---------------------------------------|
| `feat`     | New feature                           |
| `fix`      | Bug fix                               |
| `docs`     | Documentation only                    |
| `refactor` | Code change (no behavior change)      |
| `chore`    | Maintenance, dependencies, tooling    |
| `style`    | Formatting, linting (no logic change) |
| `perf`     | Performance improvement               |
| `test`     | Adding or updating tests              |
| `build`    | Build system or external deps         |
| `ci`       | CI configuration                      |
| `revert`   | Reverts a previous commit             |

### Examples

```
feat(tui): add progress bar to installation steps
fix(agent): correct Claude Code detection on macOS
docs: update contributing guide
chore(deps): bump bubbletea to v0.26
refactor(pipeline): extract step executor
style: fix linter warnings in catalog package
perf(system): cache OS detection result
test(installer): add coverage for catalog step execution
build: update goreleaser config for arm64
ci: split unit and e2e test jobs
revert: undo model picker redesign
```

### Breaking Changes

Add `!` after the type/scope and include a `BREAKING CHANGE:` footer:

```
feat(cli)!: rename --config flag to --config-file

BREAKING CHANGE: the --config flag has been renamed to --config-file.
Update your scripts and aliases accordingly.
```

Breaking changes map to the `type:breaking-change` label.

---

## Branch Naming

Branch names **must** match this pattern:

```
^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert|release|hotfix)\/[a-z0-9._-]+$
```

**Rules:**
- All lowercase
- Use hyphens, dots, or underscores as separators (no spaces, no uppercase)
- Description must be short and descriptive

**Examples:** `feat/user-login`, `fix/crash-on-startup`, `docs/api-reference`, `release/0.2.0`, `hotfix/fix-publish`

---

## Branching and Releases

This project uses GitFlow with Changesets for versioning and npm publication.

| Branch      | Purpose                                                      | Publication                    |
|-------------|--------------------------------------------------------------|--------------------------------|
| `feature/*` | Product and maintenance work                                 | None                           |
| `develop`   | Integration branch for the next release                      | Beta snapshot tagged `beta`    |
| `release/*` | Optional release stabilization branch created from `develop` | None                           |
| `main`      | Stable, production-ready releases                            | Stable release tagged `latest` |
| `hotfix/*`  | Urgent fix created from `main`                               | None                           |

### Automated Workflows

| Workflow                                | Trigger                                  | Responsibility                                                 |
|-----------------------------------------|------------------------------------------|----------------------------------------------------------------|
| `.github/workflows/ci.yml`              | Push/PR to `main` or `develop`           | Runs lint and typecheck via the reusable `check.yml`           |
| `.github/workflows/check.yml`           | Reused by other workflows                | Installs dependencies and runs `lint:ci` and `typecheck`       |
| `.github/workflows/release-prepare.yml` | Push to `develop`                        | Creates or updates the draft release PR to `main`              |
| `.github/workflows/release.yml`         | Push to `main`                           | Publishes the stable package to npm under the `latest` tag     |
| `.github/workflows/release-beta.yml`    | Push to `develop` with changeset changes | Publishes a beta snapshot to npm under the `beta` tag          |
| `.github/workflows/sync-to-develop.yml` | Merge of any PR into `main`              | Opens/updates the sync PR `internal/sync-from-main-to-develop` |

### Merge Methods per Pull Request

Use the merge method that keeps the history of `main` and `develop` aligned:

| Pull request                            | Branches                                             | Merge method     | Rationale                                                                                                       |
|-----------------------------------------|------------------------------------------------------|------------------|-----------------------------------------------------------------------------------------------------------------|
| Feature, fix, chore, docs, renovate     | `feature/*`, `fix/*`, `renovate/*` → `develop`       | **Squash merge** | Individual work branches produce one clean commit; `develop` keeps a linear history.                            |
| Hotfix                                  | `hotfix/*` → `main`                                  | **Squash merge** | The branch comes from `main`; one commit is enough and keeps `main` linear.                                        |
| Release                                 | `changeset-release/main` → `main`                    | **Merge commit** | Lets `main` absorb the full commit history from `develop`, keeping both branches aligned and preventing divergence. |
| Sync                                    | `internal/sync-from-main-to-develop` → `develop`     | **Merge commit** | Pulls the released `main` history back into `develop` without losing ancestry.                                     |

Rule of thumb:

- **Squash merge** when the source branch is a short-lived work branch whose history does not need to survive.
- **Merge commit** when the source branch is `main` or `develop`, so both branches share ancestry and future pull requests stay small.

### Daily Development

1. Create a `feature/*` branch from `develop`.
2. Add a changeset for every package behavior change with `bun changeset add`.
3. Open and merge the pull request into `develop`.
4. After CI passes, each push to `develop` that adds or modifies a changeset publishes a unique beta version to npm under the `beta` dist-tag.

Install the current beta explicitly when testing it:

```bash
npm install eslint-config@beta
```

Snapshot releases do not modify or commit version files. They use the pending changesets to calculate a version such as `0.2.0-beta-20260802153000`. Documentation, tooling, and other changes without a changeset do not publish a beta.

### Stable Release

1. When `develop` contains non-empty changesets, `release-prepare.yml` creates or updates the draft `changeset-release/main` pull request targeting `main`.
2. Validate the current beta. When it is ready, mark the generated release pull request ready for review and merge it into `main`.
3. `release.yml` on `main` publishes the stable package to npm under the `latest` dist-tag.
4. `sync-to-develop.yml` opens or rebases the automated pull request `internal/sync-from-main-to-develop → develop`. **Merge it with a merge commit** to synchronize the generated changelog, package version, and consumed changesets while keeping the full history of `main`.

The generated release pull request contains the pending changes, calculated stable version, changelog entry, and consumed changesets. Changesets release pull requests and their version commits use `chore: release v<version>`. They do not publish packages; publication remains exclusive to `main`.

### Release Stabilization

Use a `release/*` branch only when a release needs a stabilization period. It freezes the release scope while new work continues on `develop`; do not merge the automatically generated release pull request while that stabilization is in progress.

1. Create `release/<version>` from `develop`.
2. Allow only release-critical fixes, documentation updates, and QA changes on the release branch.
3. Merge the release branch into `main` when it is approved.
4. `release-prepare.yml` opens the version pull request on `main`; merge it to publish the stable package.
5. Merge the `internal/sync-from-main-to-develop` pull request from `main` to `develop` so the stabilization fixes and generated release files return to the integration branch.

GitHub Actions must be allowed to create pull requests for the automated release and sync workflows to work.

The `internal:sync` label exempts automated branch synchronization pull requests from issue and type validation. They must not include changeset files.

For an urgent production fix, create `hotfix/*` from `main`, include a changeset, merge it into `main`, then merge the resulting `internal/sync-from-main-to-develop` pull request into `develop`.

---

## Pull Request Rules

### Work-Unit Commits

Structure commits by deliverable unit, not by file type. A good commit includes the code, tests, and docs needed to understand and verify one behavior or workflow.

- Prefer `feat(auth): validate tokens at login` over separate `models`, `services`, and `tests` commits.
- Keep rollback reasonable: reverting one commit should not remove unrelated work.
- When a PR grows near 400 changed lines, promote work-unit commits into chained or stacked PRs.

### Review Comments

Review feedback should be warm, direct, and useful quickly. Start with the actionable point, explain why when needed, and avoid recapping the PR before giving feedback.

### Before Opening a PR

- [ ] There is a linked approved issue (`Closes #<N>`)
- [ ] Commits are organized by deliverable work unit
- [ ] All unit tests pass (`bun test`)
- [ ] Commits follow Conventional Commits format
- [ ] A changeset is included for any package behavior change (`bun changeset add`)
- [ ] Code is self-reviewed

### PR Title

Use the same Conventional Commits format as commit messages:

```
feat(tui): add keyboard shortcut help overlay
fix(agent): handle missing HOME env var gracefully
```

### Changesets

If your PR changes package behavior, add a changeset using `@changesets/cli`:

```bash
bun changeset add
```

Select the appropriate semver bump and describe the change. The changeset will be used to generate the changelog and version bump during release.

### Automated PR Checks

All PRs go through automated checks:

| Check                               | What It Verifies                                   |
|-------------------------------------|----------------------------------------------------|
| **Check Issue Reference**           | PR body contains `Closes/Fixes/Resolves #N`        |
| **Check Issue Has status:approved** | The linked issue has been approved by a maintainer |
| **Check PR Has type:* Label**       | Exactly one `type:*` label is applied              |
| **Unit Tests**                      | `bun test` passes                                  |
| **ESLint**                          | `bun run lint:fix` passes                          |
| **Typecheck**                       | `bun run typecheck` passes                         |

**All checks must pass** before a PR can be merged.

### Linking Your Issue

In the PR body, include one of:

```
Closes #42
Fixes #42
Resolves #42
```

---

## Code of Conduct

Be respectful. We're building something together.

- Critique code, not people
- Be constructive in reviews
- Welcome newcomers

Violations may result in removal from the project.

---

## Questions?

Use [GitHub Discussions](https://github.com/hexadrop/eslint-config/discussions) — not issues — for questions, ideas, and general conversation.
