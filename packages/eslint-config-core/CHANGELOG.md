# @hexadrop/eslint-config-core

## 1.1.0

### Patch Changes

- d5d86b8: Extract the core concern into the new `@hexadrop/eslint-config-core` package, publishable and usable standalone via its `core()` factory. The meta-package composes the raw `core`, `ignore` and `imports` configs with no behavior change. The file globs stay in the private `@hexadrop/eslint-config-shared` package and are bundled into each published package, so feature packages do not depend on core; each package only ships the globs it imports.
