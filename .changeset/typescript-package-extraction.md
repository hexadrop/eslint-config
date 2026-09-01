---
'@hexadrop/eslint-config-typescript': patch
'@hexadrop/eslint-config': patch
---

Extract the typescript concern into the new `@hexadrop/eslint-config-typescript` package, publishable and usable standalone via its `typescript()` factory. Exports globs (`JAVASCRIPT_GLOBS`, `SOURCE_GLOBS`, `TYPESCRIPT_GLOBS`, `DTS_GLOBS`, `TEST_GLOBS`) and config names consumed by dependent packages. The factory accepts a `tsconfigRootDir` option to control type-aware linting resolution. The meta-package composes it as a regular dependency with no behavior change.