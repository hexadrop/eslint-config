# Peer-present presence detection test

- **Package:** `@hexadrop/eslint-config-react`
- **Kind:** Test gap
- **Surfaced in:** Code review of PR #1047 (spec axis, finding a1), against acceptance criterion *"behavior tests cover both present and absent cases"* of #1029.
- **Pick up when:** extracting `@hexadrop/eslint-config-typescript`, or any change touching the peer gate in `src/react.config.ts`.

## The gap

The absent case is genuinely tested — the peer is not installed in this repo, so `react()` defaults and `react({ typescript: false })` exercise real absence. The present case is only exercised through the `peerCheck: false` escape hatch (`react({ peerCheck: false, typescript: true })`), which bypasses the exact code path the criterion targets: presence detection.

```ts
const isTypescript = typescriptOption ?? isTypescriptPeerInstalled;
```

No test ever runs `react()` with defaults while the peer resolves, so `isTypescriptPeerInstalled === true` flowing into `isTypescript` is unverified.

## The fix

Simulate presence with a module mock instead of installing the real package:

```ts
mock.module('local-pkg', () => ({
  isPackageExists: (name: string) => name === '@hexadrop/eslint-config-typescript',
}));
```

Then assert `react()` with defaults yields the TS-flavored output (TSX globs in `files`). One test closes the gap; keep the existing absent-case tests untouched.

## Why deferred

The peer package does not exist yet (it is extracted later in the #1024 stack), so the mock asserts against a peer that cannot be installed for real. Adding the test alongside the typescript extraction keeps mock and reality in the same PR.
