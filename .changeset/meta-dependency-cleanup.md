---
'@hexadrop/eslint-config': patch
---

Drop unused direct dependencies from the meta-package: `tslib` (not imported by source or dist, still installed transitively through core's resolver chain) and the duplicate `@typescript-eslint/eslint-plugin`/`parser` declarations (still provided by `@hexadrop/eslint-config-typescript` and the optional peers of the feature packages). The resolved config is unchanged.
