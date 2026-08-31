# Package-manager-agnostic install error

- **Package:** `@hexadrop/eslint-config-react`
- **Kind:** Wording (cosmetic)
- **Surfaced in:** Code review of PR #1047 (spec axis, finding c2), against the *"actionable install error"* criterion of #1029.
- **Pick up when:** the next edit to the peer-missing error message in `src/react.config.ts`, for any reason.

## The issue

The actionable error hardcodes one package manager:

```
bun add --dev @hexadrop/eslint-config-typescript
```

The package publishes to npm; consumers on npm, yarn, or pnpm get a command that does not run in their toolchain. "Actionable" should hold for every consumer.

## The fix

Phrase the message around the missing package, not the install command — e.g. *"install `@hexadrop/eslint-config-typescript` as a dev dependency"* — or list the command per package manager. The single-sentence form is shorter and cannot go stale.

## Why deferred

Cosmetic, and every other feature package extraction in the #1024 stack will face the same wording; fix them together in one pass when the next extraction lands rather than one message at a time.
