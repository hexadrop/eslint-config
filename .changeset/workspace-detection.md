---
'@hexadrop/eslint-config': minor
---

Detect React and tsconfigs across `package.json#workspaces` packages instead of only in `process.cwd()`. React is enabled when a workspace package declares it and its version is resolved from the workspace; when the root has no `tsconfig.json`, the workspace tsconfigs are used for type-aware linting. The previous root-only behavior remains the fallback and explicit options keep taking precedence.
