---
'@hexadrop/eslint-config': patch
---

Internal: golden-output snapshots of the resolved config plus fixture-based end-to-end lint diagnostics, using bun's built-in snapshot comparison. No consumer-facing behavior changes; the harness freezes today's output so future refactors and dependency updates can prove equivalence. Update snapshots with `bun test --update-snapshots`.
