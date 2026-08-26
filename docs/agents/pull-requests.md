# Pull requests

## Issue-first workflow

**No PR without an approved issue.**

1. Open an issue using the [Bug Report](https://github.com/hexadrop/eslint-config/issues/new?template=bug_report.yml) or [Feature Request](https://github.com/hexadrop/eslint-config/issues/new?template=feature_request.yml) template.
2. Wait for a maintainer to add the `status:approved` label.
3. Comment on the issue to claim it.
4. Open a PR referencing the approved issue.

PRs without a linked approved issue are rejected by CI.

## PR title

Use Conventional Commits format:

```
feat(scope): add keyboard shortcut help overlay
fix(scope): handle missing HOME env var gracefully
```

## PR checklist

Before opening a PR:

- [ ] Linked approved issue (`Closes #<N>`)
- [ ] Commits organized by deliverable work unit
- [ ] Conventional Commits format used
- [ ] Changeset added for any package behavior change (`bun changeset add`)
- [ ] Code self-reviewed

## Changesets

If the PR changes package behavior, add a changeset:

```bash
bun changeset add
```

Select the semver bump and describe the change. The changeset drives the changelog and version bump during release.

## Merge methods

Use the merge method that keeps `main` and `develop` aligned:

| Pull request                        | Branches                                         | Merge method     |
|-------------------------------------|--------------------------------------------------|------------------|
| Feature, fix, chore, docs, renovate | `feature/*`, `fix/*`, `renovate/*` → `develop`   | **Squash merge** |
| Hotfix                              | `hotfix/*` → `main`                              | **Squash merge** |
| Release                             | `changeset-release/main` → `main`                | **Merge commit** |
| Sync                                | `internal/sync-from-main-to-develop` → `develop` | **Merge commit** |

Rule of thumb:
- **Squash merge** for short-lived work branches whose history does not need to survive.
- **Merge commit** when the source branch is `main` or `develop`, so both branches share ancestry.

## Linking the issue

In the PR body, include one of:

```
Closes #42
Fixes #42
Resolves #42
```
