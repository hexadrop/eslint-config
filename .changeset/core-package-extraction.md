---
'@hexadrop/eslint-config-core': patch
'@hexadrop/eslint-config': patch
'@hexadrop/eslint-config-astro': patch
'@hexadrop/eslint-config-json': patch
'@hexadrop/eslint-config-markdown': patch
'@hexadrop/eslint-config-react': patch
'@hexadrop/eslint-config-stylistic': patch
'@hexadrop/eslint-config-typescript': patch
---

Extract the core concern into the new `@hexadrop/eslint-config-core` package, publishable and usable standalone via its `core()` factory. The meta-package composes the raw `core`, `ignore` and `imports` configs with no behavior change. Universal globs and the core/ignore/imports config names now live in core's public interface, and every feature package depends on core for them.
