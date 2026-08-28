---
'@hexadrop/eslint-config': patch
---

Internal: add golden-output snapshot tests covering the resolved flat config across an explicit option matrix. No consumer-facing behavior changes; the harness freezes today's output so future refactors can prove equivalence. Regenerate with `UPDATE_GOLDEN=1 bun test`.
