# @hexadrop/eslint-config-astro

## 1.0.12

### Patch Changes

- a60d291: Extract the Astro concern into the new `@hexadrop/eslint-config-astro` package, publishable and usable standalone via its `astro()` factory. The meta-package lazy-loads it via `optionalPlugin` so astro integration activates only when the consumer installs it.
- Updated dependencies [e5004c2]
  - @hexadrop/eslint-config-typescript@1.0.12
