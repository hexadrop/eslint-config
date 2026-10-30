# Automation

## `hexabot`

`hexabot` ([github.com/apps/hexadrop](https://github.com/apps/hexadrop)) is the GitHub App used by the shared workflows.

| Permission | Level | Used for |
|---|---|---|
| Contents | read & write | pushing changesets, release commits and sync branches |
| Pull requests | read & write | merging, approving and reading pull request state |
| Issues | read & write | commenting and reacting on `/merge` |
| Checks | read | reading check status |
| Metadata | read | mandatory |

The app is installed on the `hexadrop` organization and on the personal repositories that use the shared workflows.

## Identity

- `HEXABOT_CLIENT_ID` (organization variable): client id of the app.
- `HEXABOT_PRIVATE_KEY` (organization secret): private key of the app.

Personal repositories cannot read organization secrets, so both values are set per repository there. The workflows never receive the private key: they pass it to `actions/create-github-app-token`, which mints a token scoped to the current repository.

## Why an app instead of `GITHUB_TOKEN`

Commits pushed with `GITHUB_TOKEN` are authored by `github-actions[bot]`, which has no write access to the repository. GitHub then requires a maintainer approval before running the `pull_request` workflows of that commit: the required checks stay in `action_required` and the pull request never becomes mergeable on its own.

An app installation token has write access, so the checks of the new commit start without approval.

## Workflows

| Workflow | Purpose |
|---|---|
| `renovate-changesets.yml` | adds the changeset commit to dependency pull requests |
| `release-prepare.yml` | creates or updates the release pull request (`use-app-token: true`) |
| `sync-to-develop.yml` | opens the sync pull request after a merge to `main` (`use-app-token: true`) |
| `merge-command.yml` | `/merge` command: approves and enables auto-merge with the method required by the policy |

All of them live in [`hexadrop/github-workflows`](https://github.com/hexadrop/github-workflows) and are pinned by tag.

## Key rotation

The private key does not expire. To rotate it:

1. Generate a new private key in the app settings and keep the old one.
2. Update `HEXABOT_PRIVATE_KEY` in the organization and in the personal repositories.
3. Delete the old key from the app settings.

## Failure mode

If the app is unavailable, the changeset, release and sync workflows fail and `/merge` does nothing. Nothing is merged or published without the app.
