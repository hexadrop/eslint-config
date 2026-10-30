---
'@hexadrop/eslint-config': minor
---

Detect React and TypeScript across workspace packages instead of only in `process.cwd()`:

- Workspace packages are read from `package.json#workspaces` and `pnpm-workspace.yaml`, including nested, `**` and negated patterns.
- React is enabled when it is installed in the root or in any workspace package, and its version is resolved from the same directories.
- TypeScript is detected the same way, and when the root has no `tsconfig.json`, the workspace package tsconfigs are used for type-aware linting.

The previous root-only behavior remains the fallback and explicit options keep taking precedence.
